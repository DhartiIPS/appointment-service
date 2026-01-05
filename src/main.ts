import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP, 
    options: {
      host: '127.0.0.1',   
      port: 5000,
    },
  });

  await app.listen();
  console.log('Appointment Microservice is listening on port 5000');
}
bootstrap();