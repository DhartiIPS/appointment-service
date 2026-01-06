import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThanOrEqual } from 'typeorm';
import { Appointment } from './appointment.entity';
import { AppointmentStatus } from '../enums/appoointment-status';
import { DayOfWeek } from '../enums/day-of-week.enum';
import { AppointmentHistory } from './appointment-history.entity';
export class CreateAppointmentDto {
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  reason?: string;
  status?: AppointmentStatus;
}

function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) throw new Error('Time cannot be empty. Expected HH:mm');
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error(`Invalid time format: ${timeStr}. Expected HH:mm`);
  }
  return hours * 60 + minutes;
}

function doTimeSlotsOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  try {
    const s1 = timeStringToMinutes(start1);
    const e1 = timeStringToMinutes(end1);
    const s2 = timeStringToMinutes(start2);
    const e2 = timeStringToMinutes(end2);

    return s1 < e2 && s2 < e1;
  } catch (error) {
    throw new HttpException(
      `Time format error: ${error.message}`,
      HttpStatus.BAD_REQUEST
    );
  }
}

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(AppointmentHistory)
    private appointmentHistoryRepository: Repository<AppointmentHistory>,
  ) { }

  async bookAppointment(dto: CreateAppointmentDto) {
    if (dto.start_time && dto.end_time) {
      try {
        timeStringToMinutes(dto.start_time);
        timeStringToMinutes(dto.end_time);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    const appointmentDate = new Date(dto.appointment_date);
    const patientExistingAppointment = await this.appointmentRepository.findOne({
      where: {
        patient_id: dto.patient_id,
        appointment_date: appointmentDate,
        status: In([AppointmentStatus.scheduled, AppointmentStatus.confirmed]),
      },
    });

    if (patientExistingAppointment) {
      throw new HttpException(
        'You already have an appointment on this date.',
        HttpStatus.CONFLICT
      );
    }

    const dayString = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const appointmentDay: DayOfWeek = DayOfWeek[dayString as keyof typeof DayOfWeek];

    const doctorAvailability = await this.checkDoctorAvailability(
      dto.doctor_id,
      appointmentDay
    );
    const hasAvailability = Array.isArray(doctorAvailability) && doctorAvailability.length > 0;
    if (dto.start_time && dto.end_time && hasAvailability) {
      const isTimeValid = doctorAvailability.some(
        slot => dto.start_time >= slot.start_time && dto.end_time <= slot.end_time
      );

      if (!isTimeValid) {
        throw new HttpException(
          `The selected time is outside the doctor's available hours on ${appointmentDay}.`,
          HttpStatus.CONFLICT
        );
      }
      const existingAppointments = await this.appointmentRepository.find({
        where: {
          doctor_id: dto.doctor_id,
          appointment_date: appointmentDate,
          status: In([AppointmentStatus.scheduled, AppointmentStatus.confirmed]),
        },
      });

      const hasOverlap = existingAppointments.some((apt) =>
        doTimeSlotsOverlap(
          apt.start_time,
          apt.end_time,
          dto.start_time,
          dto.end_time
        )
      );

      if (hasOverlap) {
        throw new HttpException(
          'Doctor is not available during this time slot. Please choose a different time.',
          HttpStatus.CONFLICT
        );
      }
    }
    const queryRunner = this.appointmentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const appointment = this.appointmentRepository.create({
        patient_id: dto.patient_id,
        doctor_id: dto.doctor_id,
        appointment_date: appointmentDate,
        start_time: dto.start_time || '',
        end_time: dto.end_time || '',
        status: dto.status || AppointmentStatus.scheduled,
      });

      const savedAppointment = await queryRunner.manager.save(appointment);
      const history = this.appointmentHistoryRepository.create({
        appointment_id: savedAppointment.appointment_id,
        old_status: dto.status || AppointmentStatus.scheduled,
        new_status: dto.status || AppointmentStatus.scheduled,
        change_reason: 'Appointment created',
      });

      await queryRunner.manager.save(history);

      await queryRunner.commitTransaction();
      await this.emitAppointmentCreatedEvent(savedAppointment, dto);
      return savedAppointment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUpcomingAppointments(doctor_id: number) {
    return this.appointmentRepository.find({
      where: {
        doctor_id,
        appointment_date: MoreThanOrEqual(new Date()),
        status: In([AppointmentStatus.scheduled, AppointmentStatus.confirmed]),
      },
      order: { appointment_date: 'ASC' },
    });
  }

  async getDoctorAvailability(doctorId: number, date: string) {
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.toLocaleDateString("en-US", { weekday: "long" }) as DayOfWeek;

    // Fetch availability from doctor service (microservice call)
    const availabilities = await this.checkDoctorAvailability(doctorId, dayOfWeek);

    if (availabilities.length === 0) {
      return {
        available: false,
        message: `Doctor is not available on ${dayOfWeek}`,
        slots: [],
      };
    }

    const appointments = await this.appointmentRepository.find({
      where: {
        doctor_id: doctorId,
        appointment_date: selectedDate,
        status: In([AppointmentStatus.scheduled, AppointmentStatus.confirmed]),
      },
    });

    const availableSlots: any[] = [];

    for (const slot of availabilities) {
      const overlappingAppointments = appointments.filter((apt) => {
        return doTimeSlotsOverlap(
          slot.start_time,
          slot.end_time,
          apt.start_time,
          apt.end_time
        );
      });

      if (overlappingAppointments.length === 0) {
        availableSlots.push({
          start_time: slot.start_time,
          end_time: slot.end_time,
          available: true,
          booked_appointments: 0,
        });
      } else {
        const subSlots = this.generateAvailableSubSlots(
          slot.start_time,
          slot.end_time,
          overlappingAppointments
        );
        availableSlots.push(...subSlots);
      }
    }

    return {
      available: availableSlots.some((s) => s.available),
      date: selectedDate.toISOString().split('T')[0],
      dayOfWeek,
      slots: availableSlots,
    };
  }

  generateAvailableSubSlots(slotStart: string, slotEnd: string, appointments: any[]) {
    const gaps: any[] = [];
    const sortedAppointments = appointments.sort((a, b) =>
      a.start_time.localeCompare(b.start_time)
    );

    let currentStart = slotStart;

    for (const apt of sortedAppointments) {
      if (currentStart < apt.start_time) {
        gaps.push({
          start_time: currentStart,
          end_time: apt.start_time,
          available: true,
          booked_appointments: 0,
        });
      }
      currentStart = apt.end_time > currentStart ? apt.end_time : currentStart;
    }

    if (currentStart < slotEnd) {
      gaps.push({
        start_time: currentStart,
        end_time: slotEnd,
        available: true,
        booked_appointments: 0,
      });
    }

    return gaps;
  }

  async updateAppointmentStatus(
    appointment_id: number,
    newStatus: AppointmentStatus,
    reason?: string,
    changedBy?: number,
    startTime?: string,
    endTime?: string
  ) {
    const appointment = await this.appointmentRepository.findOne({
      where: { appointment_id },
    });

    if (!appointment) {
      throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
    }

    const queryRunner = this.appointmentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const oldStatus = appointment.status; // Save old status before updating

      appointment.status = newStatus;
      if (startTime) appointment.start_time = startTime;
      if (endTime) appointment.end_time = endTime;

      const updated = await queryRunner.manager.save(appointment);

      const historyData: any = {
        appointment: updated, // Pass the appointment entity, not appointment_id
        old_status: oldStatus, // Use the saved old status
        new_status: newStatus,
        change_reason: reason || 'Status updated',
      };
      if (changedBy !== undefined && changedBy !== null) {
        historyData.changed_by = changedBy;
      }

      const history = this.appointmentHistoryRepository.create(historyData);

      await queryRunner.manager.save(history);

      await queryRunner.commitTransaction();

      // Emit status change event
      await this.emitAppointmentStatusChangedEvent(updated);

      return updated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAppointmentHistory(appointment_id: number) {
    return await this.appointmentHistoryRepository.find({
      where: { appointment_id },
      order: { changed_at: 'DESC' },
    });
  }

//  async getAppointmentsByPatient(patientId: number) {
//     return await this.appointmentRepository
//       .createQueryBuilder('appointment')
//       .leftJoin(User, 'patient', 'patient.user_id = appointment.patient_id')
//       .leftJoin(User, 'doctor', 'doctor.user_id = appointment.doctor_id')
//       .addSelect('patient.full_name', 'patient_name')
//       .addSelect('doctor.full_name', 'doctor_name')
//       .where('appointment.patient_id = :patientId', { patientId })
//       .orderBy('appointment.appointment_date', 'ASC')
//       .getRawMany();
// }

  async getAppointmentCounts(patientId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalCount = await this.appointmentRepository.count({
      where: { patient_id: patientId },
    });

    const upcomingCount = await this.appointmentRepository.count({
      where: {
        patient_id: patientId,
        appointment_date: MoreThanOrEqual(today),
        status: In([AppointmentStatus.scheduled, AppointmentStatus.confirmed]),
      },
    });

    const completedCount = await this.appointmentRepository.count({
      where: {
        patient_id: patientId,
        status: AppointmentStatus.completed,
      },
    });

    const cancelledCount = await this.appointmentRepository.count({
      where: {
        patient_id: patientId,
        status: AppointmentStatus.cancelled,
      },
    });

    return {
      total: totalCount,
      upcoming: upcomingCount,
      completed: completedCount,
      cancelled: cancelledCount,
    };
  }

  async getDoctorAppointmentCounts(doctorId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalCount = await this.appointmentRepository.count({
      where: { doctor_id: doctorId },
    });

    const upcomingCount = await this.appointmentRepository.count({
      where: {
        doctor_id: doctorId,
        appointment_date: MoreThanOrEqual(today),
        status: In([AppointmentStatus.scheduled, AppointmentStatus.confirmed]),
      },
    });

    const completedCount = await this.appointmentRepository.count({
      where: {
        doctor_id: doctorId,
        status: AppointmentStatus.completed,
      },
    });

    const cancelledCount = await this.appointmentRepository.count({
      where: {
        doctor_id: doctorId,
        status: In([AppointmentStatus.cancelled, AppointmentStatus.rescheduled]),
      },
    });

    return {
      total: totalCount,
      upcoming: upcomingCount,
      completed: completedCount,
      cancelled: cancelledCount,
    };
  }

  // Microservice communication methods
  private async checkDoctorAvailability(doctorId: number, dayOfWeek: DayOfWeek): Promise<any[]> {
    // TODO: Implement RPC/REST call to doctor service
    // Example: return await this.doctorServiceClient.getAvailability(doctorId, dayOfWeek);
    return [];
  }

  private async emitAppointmentCreatedEvent(appointment: Appointment, dto: CreateAppointmentDto) {
    // TODO: Emit event via message broker (RabbitMQ, Kafka, etc.)
    // Example: await this.eventEmitter.emit('appointment.created', { appointment, dto });
  }

  private async emitAppointmentStatusChangedEvent(appointment: Appointment) {
    // TODO: Emit event via message broker
    // Example: await this.eventEmitter.emit('appointment.status.changed', { appointment });
  }
}
