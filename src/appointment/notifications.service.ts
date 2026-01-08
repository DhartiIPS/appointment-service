import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from './user.entity'; // Assuming User entity exists

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createNotification(userId: number, title: string, message: string, appointmentId?: number): Promise<Notification> {
    const notification = this.notificationRepository.create({
      user_id: userId,
      title,
      message,
      appointment_id: appointmentId,
    });
    return await this.notificationRepository.save(notification);
  }

  async getNotifications(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }
  async getNotificationsByRole(role: 'admin' | 'doctor' | 'patient'): Promise<Notification[]> {
    const users = await this.userRepository.find({
      where: { role } as any, 
      select: ['user_id'],
    });

    const userIds = users.map((u) => u.user_id);

    if (userIds.length === 0) {
      return [];
    }
    return await this.notificationRepository.find({
      where: { user_id: In(userIds) },
      order: { created_at: 'DESC' },
    });
  }
  async getAllNotifications(): Promise<Notification[]> {
    return await this.notificationRepository.find({
      order: { created_at: 'DESC' },
    });
  }
  async markAsRead(notificationId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id: notificationId } });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found`);
    }
    notification.is_read = true;
    return await this.notificationRepository.save(notification);
  }
  async markAllAsRead(userId: number) {
    return await this.notificationRepository.update(
      { user_id: userId, is_read: false },
      { is_read: true },
    );
  }
}