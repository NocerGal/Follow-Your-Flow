'use server';
import { getRequiredAuthSession } from '@/src/lib/auth';
import { NewManager, NewPartner } from './FormCreateFlow';
import { prisma } from '@/src/lib/prisma';
import { Prisma } from '@prisma/client';
import { queryManagerOnStep } from './user.query';

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
      usersOnFlow: {
        create: userIds.map((user) => ({
          user: {
            connect: {
              id: user.id,
            },
          },
        })),
      },
    },
  });

  return createFlow;
};

type ActionCreateStepTypes = {
  title: string;
  description: string;
  managers: {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      image: string | null;
    };
    userId: string;
  }[];
  status: string;
  flowId: string;
};

export const actionCreateStep = async ({
  title,
  description,
  managers,
  flowId,
}: ActionCreateStepTypes) => {
  const session = await getRequiredAuthSession();

  const createStep = await prisma.stepOnFlow.create({
    data: {
      title,
      creatorId: session.user.id,
      rank: 'aaaaa',
      description,
      flowId,
      managers: {
        create: managers.map((manager) => ({
          status: 'MANAGER',
          user: {
            connect: {
              id: manager.userId,
            },
          },
        })),
      },
    },
  });

  const stepWithManagers = { createStep, managers };

  return stepWithManagers;
};

export type NewStepType = Prisma.PromiseReturnType<typeof actionCreateStep>;

export type ManagersType = NewStepType['managers'];
