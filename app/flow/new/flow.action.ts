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
  userIds: NewManager[];
  status: string;
  flowId: string;
};

export const actionCreateStep = async ({
  title,
  description,
  userIds,
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
        create: userIds.map((userId) => ({
          status: 'MANAGER',
          user: {
            connect: {
              id: userId.id,
            },
          },
        })),
      },
    },
  });

  const managers = await queryManagerOnStep(createStep.id);
  const stepWithManagers = { createStep, managers };

  return stepWithManagers;
};

export type NewStepType = Prisma.PromiseReturnType<typeof actionCreateStep>;

export type ManagersType = NewStepType['managers'];
