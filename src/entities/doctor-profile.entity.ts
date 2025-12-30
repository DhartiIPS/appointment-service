import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('doctor_profiles')
export class DoctorProfile {
  @PrimaryColumn()
  doctor_id: number; // user_id from auth-service

  @Column({ length: 100 })
  specialization: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  consultation_fee?: number;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'int', nullable: true })
  experience_years?: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
