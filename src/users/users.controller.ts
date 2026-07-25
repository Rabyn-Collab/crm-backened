import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decoraters/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/common/decoraters/current-user.decorator';
import type { UserPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { OptionalJwtAuthGuard } from 'src/common/guards/jwt-optional.guard';



@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(
    @CurrentUser() user: UserPayload,
  ) {

    return this.usersService.findById(user.id.toString());
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: UserPayload | null,
  ) {
    return this.usersService.create(dto, user);
  }




  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.usersService.remove(id);
  }



}