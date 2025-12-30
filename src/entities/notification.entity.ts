import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  appointment_id?: number;

  @ManyToOne(() => Appointment, (appointment) => appointment.notifications)
  @JoinColumn({ name: 'appointmentAppointmentId' })
  appointment?: Appointment;
}