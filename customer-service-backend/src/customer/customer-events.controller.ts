import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { CustomerService } from './customer.service';

@Controller()
export class CustomerEventsController {
  private readonly logger = new Logger(CustomerEventsController.name);

  constructor(private readonly customerService: CustomerService) {}

  @MessagePattern('order_created')
  async handleOrderPlaced(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`[RabbitMQ Consumer] Received 'order_created' event: ${JSON.stringify(data)}`);

    try {
      await this.customerService.addOrderToCustomerHistory(
        data.customerId,
        data.orderId,
        data.totalAmount,
        new Date(data.orderDate),
        data.status,
      );
      channel.ack(originalMessage);
      this.logger.log(`[RabbitMQ Consumer] Successfully processed and acknowledged order ${data.orderId}.`);
    } catch (error) {
      this.logger.error(`[RabbitMQ Consumer] Error processing 'order_created' event for order ${data.orderId}: ${error.message}`, error.stack);
      channel.nack(originalMessage, false, true);
    }
  }

  @MessagePattern('customer_created')
  async handleCustomerCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`[RabbitMQ Consumer] Received 'customer_created' event: ${JSON.stringify(data)}`);

    try {
      this.logger.log(`[RabbitMQ Consumer] New customer created: ID - ${data.id}, Email - ${data.email}`);

      channel.ack(originalMessage);
      this.logger.log(`[RabbitMQ Consumer] Successfully processed and acknowledged customer_created event for ID: ${data.id}`);
    } catch (error) {
      this.logger.error(
        `[RabbitMQ Consumer] Error processing 'customer_created' event for ID ${data.id}: ${error.message}`,
        error.stack
      );
      channel.nack(originalMessage, false, true);
    }
  }
}