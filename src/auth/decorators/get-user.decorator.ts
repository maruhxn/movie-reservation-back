import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfo } from 'src/auth/user-info';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserInfo => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
