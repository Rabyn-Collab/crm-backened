import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';


import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { PrismaModule } from 'prisma/prisma.module';
import { PlatformModule } from './platform/platform.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    UsersModule,
    AuthModule,
    CustomersModule,
    PlatformModule,
  ],
})
export class AppModule { }