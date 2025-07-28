import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  stock: number;

  @Column()
  description: string;

  @Column() category: string;
  @Column({ default: true })
  isActive: boolean;
  @Column() imageUrl: string;
}
