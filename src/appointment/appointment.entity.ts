import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AppointmentHistory } from './appointment-history.entity';
import { AppointmentStatus } from '../enums/appoointment-status';
import { User } from './user.entity';
import { Notification } from './notification.entity';

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'doctor_id' })
  doctor: User;

  @OneToMany(() => Notification, (notification) => notification.appointment)
  notifications: Notification[];
}
