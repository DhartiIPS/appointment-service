import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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

  @Post('book')
  async bookAppointment(@Body() dto: CreateAppointmentDto) {
    return await this.appointmentService.bookAppointment(dto);
  }

  @Get('allappointment')
  async getAllAppointments(
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
  ) {
    if (patientId) {
      return this.appointmentService.getAppointmentsByPatient(
        Number(patientId),
      );
    }
    if (doctorId) {
      return this.appointmentService.getUpcomingAppointments(Number(doctorId));
    }
  }

  @Get('upcoming/:doctorId')
  async getUpcomingAppointments(@Param('doctorId') doctorId: string) {
    return await this.appointmentService.getUpcomingAppointments(
      Number(doctorId),
    );
  }

  @Get('doctor-availability/:doctorId')
  async getDoctorAvailability(
    @Param('doctorId') doctorId: string,
    @Query('date') date: string,
  ) {
    return await this.appointmentService.getDoctorAvailability(
      Number(doctorId),
      date,
    );
  }

  @Patch('update/:appointmentId')
  async updateAppointmentStatus(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: UpdateAppointmentDto,
  ) {
    const { status, start_time, end_time, reason, changed_by } = dto;
    return await this.appointmentService.updateAppointmentStatus(
      Number(appointmentId),
      status,
      reason,
      changed_by,
      start_time,
      end_time,
    );
  }

  @Get('history/:appointmentId')
  async getAppointmentHistory(@Param('appointmentId') appointmentId: string) {
    return await this.appointmentService.getAppointmentHistory(
      Number(appointmentId),
    );
  }

  @Get('counts/:patientId')
  async getAppointmentCounts(@Param('patientId') patientId: string) {
    return await this.appointmentService.getAppointmentCounts(
      Number(patientId),
    );
  }

  @Get('doctor-counts/:doctorId')
  async getDoctorAppointmentCounts(@Param('doctorId') doctorId: string) {
    return await this.appointmentService.getDoctorAppointmentCounts(
      Number(doctorId),
    );
  }

  @Patch('cancel/:appointmentId')
  async cancelAppointment(
    @Param('appointmentId') appointmentId: string,
    @Body() body: { reason?: string; cancelled_by?: number },
  ) {
    return await this.appointmentService.updateAppointmentStatus(
      Number(appointmentId),
      AppointmentStatus.cancelled,
      body.reason || 'Appointment cancelled',
      body.cancelled_by,
    );
  }

  @Patch('confirm/:appointmentId')
  async confirmAppointment(
    @Param('appointmentId') appointmentId: string,
    @Body() body: { confirmed_by?: number },
  ) {
    return await this.appointmentService.updateAppointmentStatus(
      Number(appointmentId),
      AppointmentStatus.confirmed,
      'Appointment confirmed',
      body.confirmed_by,
    );
  }

  @Patch('complete/:appointmentId')
  async completeAppointment(
    @Param('appointmentId') appointmentId: string,
    @Body() body: { completed_by?: number; notes?: string },
  ) {
    return await this.appointmentService.updateAppointmentStatus(
      Number(appointmentId),
      AppointmentStatus.completed,
      body.notes || 'Appointment completed',
      body.completed_by,
    );
  }

  @Patch('reschedule/:appointmentId')
  async rescheduleAppointment(
    @Param('appointmentId') appointmentId: string,
    @Body()
    body: {
      start_time: string;
      end_time: string;
      reason?: string;
      rescheduled_by?: number;
    },
  ) {
    return await this.appointmentService.updateAppointmentStatus(
      Number(appointmentId),
      AppointmentStatus.rescheduled,
      body.reason || 'Appointment rescheduled',
      body.rescheduled_by,
      body.start_time,
      body.end_time,
    );
  }
}