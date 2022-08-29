import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenInterface } from '../interfaces/token.interface';

export function AuthUser() {
  const jwtService: JwtService = new JwtService();

  return createParamDecorator(
    async (_data: unknown, context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];

      if (!token) throw new ForbiddenException('User not logged in');

      const decodedToken = jwtService.decode(token) as TokenInterface;

      return { id: decodedToken.id };
    },
  )();
}
