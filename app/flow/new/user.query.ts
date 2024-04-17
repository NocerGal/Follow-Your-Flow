'use server';
import { prisma } from '@/src/lib/prisma';

export const queryUserIdByUserName = async (userName: string) => {
  const userId = await prisma.user.findFirst({
    where: {
      name: userName,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return userId;
};

export const queryManagerOnStep = async (stepId: string) => {
  const managers = await prisma.userOnStep.findMany({
    where: {
      stepId: stepId,
    },
    select: {
      userId: true,
      user: true,
    },
  });
  return managers;
};
