import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerOrder, CustomerOrderStatus } from './entities/customer-order.entity'; 
import { CreateCustomerDto } from './dto/create-customer.dto';

import * as bcrypt from 'bcrypt';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    @InjectRepository(CustomerOrder)
    private customerOrderRepo: Repository<CustomerOrder>,
    private readonly rabbitService: RabbitMQService,
  ) {}


  async create(dto: CreateCustomerDto) {
    const existingCustomer = await this.customerRepo.findOne({ where: { email: dto.email } });
    if (existingCustomer) {
      throw new ConflictException(`Customer with email "${dto.email}" already exists.`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const customer = this.customerRepo.create({ ...dto, password: hashedPassword });
    const savedCustomer = await this.customerRepo.save(customer);

    // Emit event that a new customer was created (optional, for other services)
    this.rabbitService.emit('customer_created', { id: savedCustomer.id, email: savedCustomer.email })
      .catch(err => {
        console.error(`Failed to emit 'customer_created' event for ${savedCustomer.id}:`, err);
      });

    // Return a DTO or a subset of data, avoid sending password hash back
    return { message: 'Customer created successfully', data: { id: savedCustomer.id, email: savedCustomer.email, fullName: savedCustomer.fullName } };
  }


  async addOrderToCustomerHistory(
    customerId: string,
    orderId: string,
    totalAmount: number,
    orderDate: Date,
    status: CustomerOrderStatus, // Use the enum for status
  ): Promise<CustomerOrder> {
    const customer = await this.customerRepo.findOne({ where: { id: customerId } });

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${customerId}" not found. Cannot add order history.`);
    }

    // Check for existing order record to ensure idempotency
    const existingOrderHistory = await this.customerOrderRepo.findOne({ where: { orderId: orderId, customerId: customerId } });
    if (existingOrderHistory) {
      console.warn(`[CustomerService] Order ID "${orderId}" for customer "${customerId}" already exists in history. Skipping duplicate processing.`);
      // Optionally, update the status or other fields if the event implies an update
      if (existingOrderHistory.status !== status) {
          existingOrderHistory.status = status;
          await this.customerOrderRepo.save(existingOrderHistory);
          this.rabbitService.emit('order_history_updated', {
              orderId: existingOrderHistory.orderId,
              customerId: existingOrderHistory.customerId,
              status: existingOrderHistory.status,
          }).catch(err => console.error(`Failed to emit 'order_history_updated' for ${orderId}:`, err));
      }
      return existingOrderHistory;
    }

    const customerOrder = this.customerOrderRepo.create({
      customerId: customer.id,
      orderId: orderId,
      totalAmount: totalAmount,
      orderDate: orderDate,
      status: status,
      customer: customer, // Link the customer entity for the relationship
    });

    const savedOrder = await this.customerOrderRepo.save(customerOrder);

    this.rabbitService.emit('order_history_added', {
      orderId: savedOrder.orderId,
      customerId: savedOrder.customerId,
      totalAmount: savedOrder.totalAmount,
    }).catch(err => {
      console.error(`Failed to emit 'order_history_added' for ${savedOrder.orderId}:`, err);
    });

    return savedOrder;
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepo.find();
  }

 
  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found.`);
    }
    return customer;
  }

 
  async findByEmail(email: string): Promise<Customer> {
    if (!email) {
      throw new BadRequestException('Email is required.');
    }
    const customer = await this.customerRepo.findOne({ where: { email } });
    if (!customer) {
      throw new NotFoundException(`Customer with email "${email}" not found.`);
    }
    return customer;
  }


  async update(id: string, updateCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id); 

    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingCustomer = await this.customerRepo.findOne({ where: { email: updateCustomerDto.email } });
      if (existingCustomer && existingCustomer.id !== id) {
        throw new ConflictException(`Customer with email "${updateCustomerDto.email}" already exists.`);
      }
    }

    if (updateCustomerDto.password) {
      updateCustomerDto.password = await bcrypt.hash(updateCustomerDto.password, 10);
    }

    Object.assign(customer, updateCustomerDto);
    return await this.customerRepo.save(customer);
  }


  async remove(id: string): Promise<void> {
    const result = await this.customerRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID "${id}" not found.`);
    }
  }


  async getCustomerOrderHistory(customerId: string): Promise<CustomerOrder[]> {
    if (!customerId) {
      throw new BadRequestException('Customer ID is required.');
    }
    const customer = await this.customerRepo.findOne({
      where: { id: customerId },
      relations: ['orders'], 
      order: { orders: { orderDate: 'DESC' } }, 
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${customerId}" not found.`);
    }
    return customer.orders;
  }

  
}