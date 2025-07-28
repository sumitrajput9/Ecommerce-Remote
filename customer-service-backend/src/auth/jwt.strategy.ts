import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'super-secret-key', // Use env var in production
    });
  }

  async validate(payload: any) {
    const customer = await this.authService.validateCustomer(payload.id);
    if (!customer) {
      throw new UnauthorizedException('Invalid token');
    }
    return customer; // appended to req.user
  }
}
