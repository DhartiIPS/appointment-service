import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppointmentService, CreateAppointmentDto } from './appointment.service';
import { AppointmentStatus } from '../enums/appoointment-status';

export class UpdateAppointmentDto {
  status: AppointmentStatus;
  start_time?: string;
  end_time?: string;
  reason?: string;
  changed_by?: number;
}

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @MessagePattern('book')
  async bookAppointment(data: CreateAppointmentDto) {
    return await this.appointmentService.bookAppointment(data);
  }

  @MessagePattern('allappointment')
  async getAllAppointments(data: { patientId?: number; doctorId?: number; userId?: number }) {
  const patientId = data.patientId || data.userId; 
  const doctorId = data.doctorId;

  if (patientId) {
    return this.appointmentService.getAppointmentsByPatient(patientId);
  }
  if (doctorId) {
    return this.appointmentService.getUpcomingAppointments(doctorId);
  }
  
  return [];
}

  @MessagePattern('get-appointment')
  async getAppointment(data: { appointmentId: string }) {
    return await this.appointmentService.getAppointmentsByPatient(Number(data.appointmentId));
  }

  @MessagePattern('doctor_availability')
  async getDoctorAvailability(data: { doctorId: number; date: string }) {
    return await this.appointmentService.getDoctorAvailability(
      data.doctorId,
      data.date,
    );
  }

  @MessagePattern('update/:appointmentId')
  async updateAppointmentStatus(data: { appointmentId: number } & UpdateAppointmentDto) {
    const { appointmentId, status, start_time, end_time, reason, changed_by } = data;
    return await this.appointmentService.updateAppointmentStatus(
      appointmentId,
      status,
      reason,
      changed_by,
      start_time,
      end_time,
    );
  }

  @MessagePattern('history/:appointmentId')
  async getAppointmentHistory(data: { appointmentId: number }) {
    return await this.appointmentService.getAppointmentHistory(data.appointmentId);
  }

  @MessagePattern('patient_appointment_counts')
  getPatientAppointmentCounts(data: { patientId: number }) {
    return this.appointmentService.getAppointmentCounts(data.patientId);
  }
  
  @MessagePattern('doctor_appointment_counts')
  async getDoctorAppointmentCounts(data: { doctorId: number }) {
    console.log('Received doctor_appointment_counts request:', data);
    return await this.appointmentService.getDoctorAppointmentCounts(Number(data.doctorId));
  }

  @MessagePattern('cancel/:appointmentId')
  async cancelAppointment(data: { appointmentId: number; reason?: string; cancelled_by?: number }) {
    return await this.appointmentService.updateAppointmentStatus(
      data.appointmentId,
      AppointmentStatus.cancelled,
      data.reason || 'Appointment cancelled',
      data.cancelled_by,
    );
  }

  @MessagePattern('confirm/:appointmentId')
  async confirmAppointment(data: { appointmentId: number; confirmed_by?: number }) {
    return await this.appointmentService.updateAppointmentStatus(
      data.appointmentId,
      AppointmentStatus.confirmed,
      'Appointment confirmed',
      data.confirmed_by,
    );
  }

  @MessagePattern('complete/:appointmentId')
  async completeAppointment(data: { appointmentId: number; completed_by?: number; notes?: string }) {
    return await this.appointmentService.updateAppointmentStatus(
      data.appointmentId,
      AppointmentStatus.completed,
      data.notes || 'Appointment completed',
      data.completed_by,
    );
  }

  @MessagePattern('reschedule/:appointmentId')
  async rescheduleAppointment(data: {
    appointmentId: number;
    start_time: string;
    end_time: string;
    reason?: string;
    rescheduled_by?: number;
  }) {
    return await this.appointmentService.updateAppointmentStatus(
      data.appointmentId,
      AppointmentStatus.rescheduled,
      data.reason || 'Appointment rescheduled',
      data.rescheduled_by,
      data.start_time,
      data.end_time,
    );
  }

  @MessagePattern('doctor-profile')
  async getDoctorProfile(data: { doctorId: number }) {
    // Implement or delegate to doctor service
    return { doctorId: data.doctorId, message: 'Doctor profile placeholder' };
  }

  @MessagePattern('search-doctors')
  async searchDoctors(data: any) {
    // Implement or delegate to doctor service
    return { message: 'Search doctors placeholder', query: data };
  }

  @MessagePattern('get-hospitals')
  async getHospitals() {
    // Implement or delegate to hospital service
    return { message: 'Hospitals list placeholder' };
  }

  @MessagePattern('get_upcoming_appointments')
  async getUpcomingAppointments(data: { doctor: number }) {
    return await this.appointmentService.getUpcomingAppointments(data.doctor);
  }
}
