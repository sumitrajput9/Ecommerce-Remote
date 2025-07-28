import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity'; 

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string; 
  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 }) 
  price: number; 

  @Column({ type: 'uuid' }) 
  orderId: string;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' }) 
  order: Order;
}