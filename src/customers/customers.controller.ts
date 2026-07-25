import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { Role } from '@prisma/client';

import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from 'src/common/decoraters/current-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Roles } from 'src/common/decoraters/roles.decorator';



@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
  ) { }

  @Get()
  findAll(
    @CurrentUser() user: JwtPayload,
  ) {
    return this.customersService.findAll(user);
  }

  @Get(':id')
  findOne(
    @Param('id') id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.customersService.findOne(id, user);
  }

  @Post()
  create(
    @Body() dto: CreateCustomerDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.customersService.create(user, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateCustomerDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.customersService.update(
      id,
      user,
      dto,
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  remove(
    @Param('id') id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.customersService.remove(id, user);
  }
}