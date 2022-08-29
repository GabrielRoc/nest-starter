import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(AuthService)
  private readonly authService: AuthService;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  private validate(payload: string): Promise<User | never> {
    return this.authService.validateUser(payload);
  }
}
