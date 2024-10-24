import { Role } from '@prisma/client';

export class UserResponse {
  username?: string;
  email?: string;
  role?: string;
  accessToken?: string;
}

export class RegisterUserRequest {
  username: string;
  password: string;
  email: string;
  role?: Role;
}

export class LoginUserRequest {
  email: string;
  password: string;
}
