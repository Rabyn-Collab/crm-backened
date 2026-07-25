import {
  PrismaClient,
  Role,
  TenantStatus,
} from '@prisma/client';

import * as bcrypt from 'bcrypt';


const prisma = new PrismaClient();


async function main() {


  // Clean database (development only)
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();



  /*
    1. Create Platform Admin
  */

  const superAdminPassword =
    await bcrypt.hash(
      'password123',
      10
    );


  const superAdmin =
    await prisma.user.create({

      data: {

        email:
          'owner@crm.com',

        password:
          superAdminPassword,

        role:
          Role.SUPER_ADMIN,

        tenantId:
          null,
      },

    });



  /*
    2. Create Tenant
  */

  const tenant =
    await prisma.tenant.create({

      data: {

        name:
          'ABC School',

        status:
          TenantStatus.ACTIVE,

      },

    });



  /*
    3. Create Tenant Admin
  */

  const adminPassword =
    await bcrypt.hash(
      'password123',
      10
    );


  const tenantAdmin =
    await prisma.user.create({

      data: {

        email:
          'admin@abcschool.com',

        password:
          adminPassword,

        role:
          Role.ADMIN,

        tenantId:
          tenant.id,

      },

    });



  /*
    4. Create Tenant Member
  */


  const memberPassword =
    await bcrypt.hash(
      'password123',
      10
    );


  const member =
    await prisma.user.create({

      data: {

        email:
          'member@abcschool.com',

        password:
          memberPassword,

        role:
          Role.MEMBER,

        tenantId:
          tenant.id,

      },

    });



  /*
    5. Create Customers
  */


  await prisma.customer.createMany({

    data: [

      {
        name:
          'Ram Sharma',

        email:
          'ram@gmail.com',

        phone:
          '9800000001',

        tenantId:
          tenant.id,
      },


      {
        name:
          'Sita Sharma',

        email:
          'sita@gmail.com',

        phone:
          '9800000002',

        tenantId:
          tenant.id,
      },

    ],

  });



  console.log('Seed completed');

  console.log({
    superAdmin,
    tenant,
    tenantAdmin,
    member,
  });

}



main()

  .catch((error) => {

    console.error(error);

    process.exit(1);

  })

  .finally(async () => {

    await prisma.$disconnect();

  });