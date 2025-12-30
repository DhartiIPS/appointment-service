import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('doctor_hospitals')
export class DoctorHospital {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  doctor_id: number;

  @Column()
  hospital_id: number;
}
