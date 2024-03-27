const { PrismaClient } = require('@prisma/client');
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Génération et insertion des utilisateurs
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        image: faker.image.avatar(),
      },
    });
  }

  // Génération et insertion des flows
  const users = await prisma.user.findMany();
  for (const user of users) {
    const flow = await prisma.flow.create({
      data: {
        title: faker.lorem.words(),
        description: faker.lorem.sentence(),
        creator: {
          connect: { id: user.id },
        },
      },
    });

    // Génération et insertion de UserOnFlow
    await prisma.userOnFlow.create({
      data: {
        userId: user.id,
        flowId: flow.id,
        status: 'USER',
      },
    });

    // Génération et insertion de StepOnFlow
    await prisma.stepOnFlow.create({
      data: {
        title: faker.lorem.words(),
        rank: faker.datatype.string(1),
        description: faker.lorem.sentence(),
        flowId: flow.id,
        creatorId: user.id,
      },
    });
  }

  console.log('Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
