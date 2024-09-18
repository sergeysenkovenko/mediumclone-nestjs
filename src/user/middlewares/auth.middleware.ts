import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { IExpressRequest } from '@app/types/expressRequest.interface';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@app/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async use(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    const secretJWT = this.configService.get('JWT_ACCESS_SECRET');

    try {
      const decoded = verify(token, secretJWT) as { id: number };
      req.user = await this.userService.findById(decoded.id);
      next();
    } catch {
      req.user = null;
      next();
    }
  }
}
