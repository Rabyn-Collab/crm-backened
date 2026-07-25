import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { PlatformService } from './platform.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';
import { CreateTenantDto } from './dto/create-tenant.dto';



@Controller('platform')
@UseGuards(
  JwtAuthGuard,
  SuperAdminGuard
)
export class PlatformController {


  constructor(
    private platformService: PlatformService
  ) { }



  @Post('tenants')
  createTenant(
    @Body() dto: CreateTenantDto
  ) {

    return this.platformService
      .createTenant(dto);

  }



  @Get('tenants')
  findTenants() {

    return this.platformService
      .findTenants();

  }



  @Get('tenants/:id')
  findTenant(
    @Param('id') id: string
  ) {

    return this.platformService
      .findTenant(id);

  }



  @Patch('tenants/:id/suspend')
  suspendTenant(
    @Param('id') id: string
  ) {

    return this.platformService
      .suspendTenant(id);

  }


}