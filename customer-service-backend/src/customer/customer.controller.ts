import { Controller, Post, Body, Get, Param, Put, Delete, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.customerService.create(dto);
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Get('by-email/query')
  findByEmail(@Query('email') email: string) {
    return this.customerService.findByEmail(email);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateCustomerDto) {
    return this.customerService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
  @Get(':id/orders')
  getCustomerOrderHistory(@Param('id') customerId: string) {
    return this.customerService.getCustomerOrderHistory(customerId);
  }
}
