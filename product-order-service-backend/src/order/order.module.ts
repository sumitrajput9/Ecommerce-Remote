import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ProductModule } from '../product/product.module'; 
@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), ProductModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
