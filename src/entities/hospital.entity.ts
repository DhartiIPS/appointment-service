import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('hospitals')
export class Hospital {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;
}
