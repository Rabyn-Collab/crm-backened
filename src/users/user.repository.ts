import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        tenant: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        tenant: true,
      },
      omit: {
        password: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: {
    email: string;
    password: string;
    role: Role;
    tenantId?: number | null;
  }) {
    return this.prisma.user.create({
      data,
    });
  }
  update(id: string, data: Partial<CreateUserDto>) {
    return this.prisma.user.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.user.delete({
      where: { id: parseInt(id) },
    });
  }
}