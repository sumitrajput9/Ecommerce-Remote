
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @CreateDateColumn()
  createdAt: Date; 
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: ['insert', 'update'] })
  orderItems: OrderItem[]; 
}