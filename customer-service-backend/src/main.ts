// customer-service/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices'; // Import Transport
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('CustomerServiceBootstrap');

  // Create the main HTTP application (for REST API)
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: '*', // For development, allow all. In production, specify your Next.js frontend URL(s).
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api'); 

  const restPort = 3001; 
  await app.listen(restPort);
  logger.log(`Customer Service (REST API) running on http://localhost:${restPort}`);

  // Create a separate microservice instance for RabbitMQ listening
  const microservice = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // Hardcoded RabbitMQ URL
      queue: 'customer_queue',         // Hardcoded RabbitMQ Queue Name
      queueOptions: {
        durable: true, // Should match producer's durable option
      },
      noAck: false, // Crucial: Set to false for manual acknowledgment
    },
  });

  await microservice.listen();
  logger.log(`Customer Service (RabbitMQ Listener) listening for messages on queue "customer_queue"`);
}
bootstrap();