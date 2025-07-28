import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customer/entities/customer.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; // make sure you have this

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    JwtModule.register({
      secret: 'super-secret-key', // In production, use process.env.JWT_SECRET
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
