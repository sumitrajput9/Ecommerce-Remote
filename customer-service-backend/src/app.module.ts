import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { Customer } from './customer/entities/customer.entity';
import { CustomerOrder } from './customer/entities/customer-order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'newpassword',
      database: 'customer_db',
      entities: [Customer,CustomerOrder],
      synchronize: true,
    }),
    CustomerModule,
    AuthModule,
  ],
})
export class AppModule {}
