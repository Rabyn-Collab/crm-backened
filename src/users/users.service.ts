import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';


import * as bcrypt from 'bcrypt';


import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './user.repository';
import { Role } from '@prisma/client';
import { UserPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) { }

  async findById(id: string) {
    return this.usersRepository.findById(id);
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async create(dto: CreateUserDto, currentUser: UserPayload | null) {
    const existingUser = await this.usersRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const password = await bcrypt.hash(dto.password, 10);

    if (!currentUser) {
      if (dto.role !== Role.SUPER_ADMIN) {
        throw new ForbiddenException('Only role with super admin are allowed');
      }

      return this.usersRepository.create({
        email: dto.email,
        password,
        role: dto.role,
      });
    }

    // Authenticated flow: only tenant admins can create tenant users
    if (currentUser.role === Role.SUPER_ADMIN || currentUser.role === Role.MEMBER) {
      throw new ForbiddenException("super admin and members can't create tenant users");
    }

    if (currentUser.tenantId !== dto.tenantId) {
      throw new ForbiddenException('You can only create users for your own tenant');
    }

    if (dto.role === Role.SUPER_ADMIN || dto.role === Role.ADMIN) {
      throw new ForbiddenException('Please select a member role');
    }

    return this.usersRepository.create({
      email: dto.email,
      password,
      role: dto.role,
      tenantId: currentUser.tenantId,
    });
  }



  async remove(id: string) {
    const user =
      await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return this.usersRepository.delete(id);
  }
}