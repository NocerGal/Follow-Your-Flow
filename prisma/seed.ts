// import { prisma } from '@/src/lib/prisma';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Générer des données pour 10 utilisateurs
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        image: faker.image.avatar(),
      },
    });

    const flow = await prisma.flow.create({
      data: {
        title: faker.lorem.word(),
        description: faker.lorem.sentence(),
        creatorId: user.id, // Utilisez id directement
      },
    });

    await prisma.userOnFlow.create({
      data: {
        flowId: flow.id,
        userId: user.id,
      },
    });

    for (let j = 0; j < 5; j++) {
      const step = await prisma.stepOnFlow.create({
        data: {
          name: faker.lorem.words(),
          rank: j,
          description: faker.lorem.sentence(),
          flowId: flow.id,
        },
      });

      await prisma.usersOnStep.create({
        data: {
          userId: user.id,
          stepOnFlowId: step.id,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
