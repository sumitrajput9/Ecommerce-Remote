import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order ,OrderStatus} from './entity/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './entity/order-item.entity';
import { RabbitMQService } from 'src/common/rabbitmq/rabbitmq.service';
import {  OnModuleInit, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {  DataSource } from 'typeorm'; 
import { ProductService } from '../product/product.service'; 
import { ClientProxy } from '@nestjs/microservices';

 

@Injectable()
export class OrderService implements OnModuleInit {
  private customerClient: ClientProxy;

  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,

    private readonly productService: ProductService,
    private dataSource: DataSource,
  ) {
    this.customerClient = RabbitMQService.getClient('customer_queue');
  }

  async onModuleInit() {
    await this.customerClient.connect();
  }

  async createOrder(dto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orderItems: OrderItem[] = [];
      let totalAmount = 0;

      for (const itemDto of dto.items) {
        const product = await this.productService.findOne(itemDto.productId);

        if (!product) {
          throw new NotFoundException(`Product with ID "${itemDto.productId}" not found.`);
        }
        if (product.stock < itemDto.quantity) {
          throw new BadRequestException(`Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${itemDto.quantity}.`);
        }

        product.stock -= itemDto.quantity;
        await queryRunner.manager.save(product);

        const orderItem = this.orderItemRepo.create({
          productId: itemDto.productId,
          quantity: itemDto.quantity,
          price: product.price,
        });
        orderItems.push(orderItem);
        totalAmount += product.price * itemDto.quantity;
      }

      const newOrder = this.orderRepo.create({
        customerId: dto.customerId,
        status: OrderStatus.PENDING, // Assign initial status from enum
        totalAmount: totalAmount,
        // createdAt is automatically handled by @CreateDateColumn in the entity
      });

      await queryRunner.manager.save(newOrder);

      orderItems.forEach(item => item.orderId = newOrder.id);
      await queryRunner.manager.save(orderItems);

      await queryRunner.commitTransaction();

      this.customerClient.emit('order_created', {
        orderId: newOrder.id,
        customerId: newOrder.customerId,
        totalAmount: newOrder.totalAmount,
        status: newOrder.status,
        orderDate: newOrder.createdAt.toISOString(), // Use createdAt from the saved order
        items: orderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      }).toPromise()
        .catch(err => {
          console.error(`Failed to send order_created event for order ${newOrder.id} to RabbitMQ:`, err);
        });

      return newOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error creating order:', error);
      throw new InternalServerErrorException('Failed to create order due to an internal error.');
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.orderRepo.find({ relations: ['orderItems'] }); // Consistent relation name
  }

  findOne(id: string) {
    return this.orderRepo.findOne({ where: { id }, relations: ['orderItems'] }); // Consistent relation name
  }
  
  async findOrdersByCustomerId(customerId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { customerId },
      relations: ['orderItems'], 
      order: { createdAt: 'DESC' }, 
    });
  }
}