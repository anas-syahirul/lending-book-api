import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddelware implements NestMiddleware {
  private readonly secretKey: string;
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {
    this.secretKey = this.configService.get<string>('JWT_SECRET');
  }
  async use(req: any, res: any, next: (error?: Error | any) => void) {
    let token = req.headers['authorization'] as string;
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, this.secretKey);
    req.user = verified;
    next();
  }
}
