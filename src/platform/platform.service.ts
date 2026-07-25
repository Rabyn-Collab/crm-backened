import {
  ConflictException,
  Injectable,
} from '@nestjs/common';





import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class PlatformService {


  constructor(
    private prisma: PrismaService
  ) { }



  async createTenant(dto: any) {


    const existingTenant = await this.prisma.tenant.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (existingTenant) {
      throw new ConflictException('Tenant name already exists');
    }

    const tenant =
      await this.prisma.tenant.create({

        data: {
          name: dto.name
        }

      });


    const password =
      await bcrypt.hash(
        dto.adminPassword,
        10
      );



    await this.prisma.user.create({

      data: {
        email: dto.adminEmail,
        password,
        role: 'ADMIN',
        tenantId: tenant.id
      }

    });


    return {
      tenant
    };


  }



  findTenants() {

    return this.prisma.tenant.findMany({

      include: {
        users: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }

    });

  }




  findTenant(id: string) {


    return this.prisma.tenant.findUnique({

      where: {
        id: parseInt(id)
      }

    });

  }



  async suspendTenant(id: string) {


    return this.prisma.tenant.update({

      where: {
        id: parseInt(id)
      },

      data: {
        status: 'SUSPENDED'
      }

    });

  }


}