'use server';
import { getRequiredAuthSession } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';
import { NewPartner } from './FormCreateFlow';

type ActionCreateFlowTypes = {
  title: string;
  description: string;
  userIds: NewPartner[];
};

export const actionCreateFlow = async ({
  title,
  description,
  userIds,
}: ActionCreateFlowTypes) => {
  const session = await getRequiredAuthSession();
  const creatorId = session.user.id;

  const createFlow = await prisma.flow.create({
    data: {
      title,
      description,
      creator: {
        connect: { id: creatorId },
      },
      users: {
        create: userIds.map((userId) => ({
          user: {
            connect: { id: userId.id },
          },
        })),
      },
    },
    include: {
      users: true,
    },
  });
  return createFlow;
};
