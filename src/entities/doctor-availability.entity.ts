import { DayOfWeek } from '../enums/day-of-week.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('doctor_availability')
export class DoctorAvailability {
  @PrimaryGeneratedColumn()
  availability_id: number;

  // 🔑 reference only
  @Column()
  doctor_id: number;

  @Column({ type: 'enum', enum: DayOfWeek })
  day_of_week: DayOfWeek;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
