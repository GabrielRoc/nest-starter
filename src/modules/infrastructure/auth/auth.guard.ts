import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
  handleRequest(err: unknown, user: User): any {
    return user;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const { user }: Request = context.switchToHttp().getRequest();

    return user ? true : false;
  }
}
