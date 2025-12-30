import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../entities/user.entity';
import { DoctorAvailability } from '../entities/doctor-availability.entity';
import { AdminSettings } from '../entities/admin-settings.entity';
import { DoctorProfile } from '../entities/doctor-profile.entity';
import { DoctorHospital } from '../entities/doctor-specialty.entity';
import { Hospital } from '../entities/hospital.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',  // Changed from DB_USERNAME to DB_USER
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'appointment_doctor',
  entities: [User, DoctorAvailability, AdminSettings, DoctorProfile, DoctorHospital, Hospital],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});