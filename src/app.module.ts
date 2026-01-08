import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentController } from './appointment/appointments.controller';
import { AppointmentService } from './appointment/appointment.service';
import { Appointment } from './appointment/appointment.entity';
import { AppointmentHistory } from './appointment/appointment-history.entity';
import { User } from './appointment/user.entity';
import { Notification } from './appointment/notification.entity';
import { NotificationService } from './appointment/notifications.service';
import { NotificationController } from './appointment/notifications.controller';

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
          User,
          Notification
        ],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: true,
      }),
      inject: [ConfigService],
    }),
    
    
    TypeOrmModule.forFeature([
      Appointment,
      AppointmentHistory,
      User,
      Notification
    ]),
  ],
  controllers: [AppController, AppointmentController,NotificationController],
  providers: [AppService, AppointmentService,NotificationService],
})
export class AppModule {}
