import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { AppointmentStatus } from '../enums/appoointment-status'; // Import from enum file

@Entity('appointment_history')
export class AppointmentHistory {
  @PrimaryGeneratedColumn()
  history_id: number;

  @Column()
  appointment_id: number;

  @Column({ nullable: true })
  changed_by?: number;

  @Column({ 
    type: 'enum', 
    enum: AppointmentStatus, 
    nullable: true 
  })
  old_status?: AppointmentStatus;

  @Column({ 
    type: 'enum', 
    enum: AppointmentStatus 
  })
  new_status: AppointmentStatus;

  @Column({ nullable: true })
  change_reason?: string;

  @CreateDateColumn()
  changed_at: Date;

  @ManyToOne(() => Appointment, appointment => appointment.history)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;
}