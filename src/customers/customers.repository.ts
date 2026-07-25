import { Injectable } from '@nestjs/common';
import {
  Prisma,
} from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';



@Injectable()
export class CustomersRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  findAll(tenantId: number) {
    return this.prisma.customer.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findById(
    id: number,
    tenantId: number,
  ) {
    return this.prisma.customer.findFirst({
      where: {
        id,
        tenantId,
      },
    });
  }

  create(data: Prisma.CustomerCreateInput) {
    return this.prisma.customer.create({
      data,
    });
  }

  update(
    id: number,
    data: Prisma.CustomerUpdateInput,
  ) {
    return this.prisma.customer.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(id: number) {
    return this.prisma.customer.delete({
      where: {
        id,
      },
    });
  }
}