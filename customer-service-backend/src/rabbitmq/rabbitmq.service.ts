import { Injectable, OnModuleInit } from '@nestjs/common'; 
import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService implements OnModuleInit { 
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'], 
        queue: 'customer_queue',         
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  async onModuleInit() {
    await this.client.connect();
  }

  emit(pattern: string, data: any) {
    return this.client.emit(pattern, data).toPromise();
  }
}