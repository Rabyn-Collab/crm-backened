import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';



import { LoginDto } from './dto/login.dto';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const valid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!valid) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    };

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      accessToken: await this.jwtService.signAsync(
        payload,
      ),
    };
  }
}