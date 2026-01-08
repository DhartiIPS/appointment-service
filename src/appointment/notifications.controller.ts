import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationService } from './notifications.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('notifications_by_user')
  async getNotifications(data: { userId: number }) {
    return await this.notificationService.getNotifications(data.userId);
  }

  @MessagePattern('admin_all_notifications')
  async getAllNotifications() {
    return await this.notificationService.getAllNotifications();
  }

  @MessagePattern('notifications_by_role')
  async getNotificationsByRole(data: { role: 'admin' | 'doctor' | 'patient' }) {
    return await this.notificationService.getNotificationsByRole(data.role);
  }

  @MessagePattern('notification_mark_read')
  async markAsRead(data: { notificationId: number }) {
    return await this.notificationService.markAsRead(data.notificationId);
  }

  @MessagePattern('notification_mark_all_read')
  async markAllAsRead(data: { userId: number }) {
    return await this.notificationService.markAllAsRead(data.userId);
  }

  // @MessagePattern('notification_create')
  // async createNotification(data: {
  //   userId: number;
  //   title: string;
  //   message: string;
  //   appointmentId?: number;
  // }) {
  //   return await this.notificationService.createNotification(
  //     data.userId,
  //     data.title,
  //     data.message,
  //     data.appointmentId,
  //   );
  // }
}
