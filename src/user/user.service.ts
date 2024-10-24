import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { LoginUserRequest, RegisterUserRequest } from 'src/model/user.model';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly secretKey: string;
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private configService: ConfigService,
  ) {
    this.secretKey = this.configService.get<string>('JWT_SECRET');
  }

  async register(request: RegisterUserRequest) {
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);
    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });
    if (totalUserWithSameUsername != 0) {
      throw new HttpException('Username already used', 400);
    }
    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  async login(request: LoginUserRequest) {
    const loginRequest: LoginUserRequest =
      await this.validationService.validate(UserValidation.LOGIN, request);
    const user = await this.prismaService.user.findUnique({
      where: {
        email: loginRequest.email,
      },
    });
    if (!user) {
      throw new HttpException('invalid email', 401);
    }

    const isPassValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPassValid) {
      throw new HttpException('invalid password', 401);
    }

    // const secretKey = process.env.JWT_SECRET;

    const accessToken = jwt.sign({ ...user }, this.secretKey, {
      expiresIn: '1d',
    });

    return {
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken,
    };
  }
}
