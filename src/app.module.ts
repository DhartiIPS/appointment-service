import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentController } from './appointment/appointments.controller';
import { AppointmentService } from './appointment/appointment.service';
import { Appointment } from './appointment/appointment.entity';
import { AppointmentHistory } from './appointment/appointment-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: configService.get('DB_PORT') || 5432,
        username: configService.get('DB_USER') || 'postgres',
        password: configService.get('DB_PASSWORD') || 'ips12345',
        database: configService.get('DB_NAME') || 'appointment_doctor',
        entities: [
          Appointment, 
          AppointmentHistory,
        ],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: true,
      }),
      inject: [ConfigService],
    }),
    
    
    TypeOrmModule.forFeature([
      Appointment, 
      AppointmentHistory,
    ]),
  ],
  controllers: [AppController, AppointmentController],
  providers: [AppService, AppointmentService],
})
export class AppModule {}
