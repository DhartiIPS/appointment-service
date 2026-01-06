import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AppointmentHistory } from './appointment-history.entity';
import { AppointmentStatus } from '../enums/appoointment-status'; // Import from enum file

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  appointment_id: number;

  @Column()
  doctor_id: number;

  @Column()
  patient_id: number;

  @Column({ type: 'date' })
  appointment_date: Date;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @Column({ type: 'enum', enum: AppointmentStatus })
  status: AppointmentStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => AppointmentHistory, (history) => history.appointment)
  history: AppointmentHistory[];
}