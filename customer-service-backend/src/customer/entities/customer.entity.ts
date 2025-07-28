import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { CustomerOrder } from './customer-order.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => CustomerOrder, (customerOrder) => customerOrder.customer)
  orders: CustomerOrder[];
}
