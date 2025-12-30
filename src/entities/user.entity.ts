
import { Role } from '../enums/role.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ length: 100 })
  full_name: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  license_number?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  
}
