import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CustomersRepository } from './customers.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class CustomersService {
  constructor(
    private readonly customersRepository: CustomersRepository,
  ) { }

  async findAll(user: JwtPayload) {
    return this.customersRepository.findAll(user.tenantId!);
  }

  async findOne(id: number, user: JwtPayload) {
    const customer = await this.customersRepository.findById(
      id,
      user.tenantId!,
    );

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async create(
    user: JwtPayload,
    dto: CreateCustomerDto,
  ) {
    return this.customersRepository.create({
      ...dto,
      tenant: {
        connect: {
          id: user.tenantId,
        },
      },
    });
  }

  async update(
    id: number,
    user: JwtPayload,
    dto: UpdateCustomerDto,
  ) {
    const customer = await this.customersRepository.findById(
      id,
      user.tenantId!,
    );

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.customersRepository.update(
      customer.id,
      dto,
    );
  }

  async remove(
    id: number,
    user: JwtPayload,
  ) {
    const customer = await this.customersRepository.findById(
      id,
      user.tenantId!,
    );

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    await this.customersRepository.delete(customer.id);

    return {
      message: 'Customer deleted successfully',
    };
  }
}