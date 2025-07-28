import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Customer } from './customer.entity';

// Optional: Define an enum for consistency with OrderService's OrderStatus
export enum CustomerOrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  // Add other statuses as needed, mirroring the Order service
}

@Entity('customer_orders') // This will be the name of your table in the database
export class CustomerOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Primary key for this customer's order history record

  @Column({ type: 'uuid', unique: true }) // The original order ID from the Order Service (should be unique in customer_db)
  orderId: string;

  @Column({ type: 'uuid' }) // The ID of the customer associated with this order history
  customerId: string;

  @Column('decimal', { precision: 10, scale: 2 }) // Total amount of the order
  totalAmount: number;

  @Column({ type: 'timestamp with time zone' }) // Date when the order was placed (from the event)
  orderDate: Date;

  @Column({ type: 'enum', enum: CustomerOrderStatus, default: CustomerOrderStatus.PENDING }) // Status of the order
  status: CustomerOrderStatus;

  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(() => Customer, customer => customer.orders)
  @JoinColumn({ name: 'customerId' }) 
  customer: Customer; 
}