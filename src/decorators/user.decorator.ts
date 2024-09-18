import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IExpressRequest } from '@app/types/expressRequest.interface';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IExpressRequest>();

    if (!request) {
      return null;
    }

    if (data) {
      return request.user[data];
    }

    return request.user;
  },
);
