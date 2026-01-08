import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notifications.controller';
import { Notification } from './notification.entity';
import { User } from './user.entity';
import { Appointment } from './appointment.entity'; 
import { NotificationService } from './notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User, Appointment]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationsModule {}