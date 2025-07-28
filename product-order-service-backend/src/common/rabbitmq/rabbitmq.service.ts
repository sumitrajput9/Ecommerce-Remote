import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const RabbitMQService = {
  getClient(queue: string) {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue,
        queueOptions: {
          durable: true,
        },
      },
    });
  },
};
