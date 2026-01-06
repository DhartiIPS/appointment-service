import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentHistory } from "src/appointment/appointment-history.entity";
import { Appointment } from "src/appointment/appointment.entity";
import { AppointmentService } from "./appointment.service";
import { AppointmentController } from "./appointments.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, AppointmentHistory]),
  ],
  providers: [AppointmentService],
  controllers: [AppointmentController],
  exports: [AppointmentService],
})
export class AppointmentModule {}