import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer } from './entities/customer.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { CustomerOrder } from './entities/customer-order.entity';
import { CustomerEventsController } from './customer-events.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer,CustomerOrder]),
    PassportModule,
    JwtModule.register({
      secret: 'super-secret-key', // replace with env var in prod
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [CustomerController, AuthController, CustomerEventsController],
  providers: [
    CustomerService,
    AuthService,
    JwtStrategy,
    RabbitMQService,
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
