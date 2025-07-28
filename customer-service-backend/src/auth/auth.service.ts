import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customer/entities/customer.entity';
import { LoginDto } from '../customer/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    private jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    const user :any= await this.customerRepo.findOne({
      where: { email: loginDto.email },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async validateCustomer(customerId: number): Promise<Customer | null> {
    return this.customerRepo.findOne({ where: { id: customerId.toString() } });
  }
}
