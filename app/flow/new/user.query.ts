'use server';
import { prisma } from '@/src/lib/prisma';

const queryUserId = async (userName: string) => {
  const userId = await prisma.user.findFirst({
    where: { name: userName },
  });
  return userId!.id;
};

export const queryUserByUserName = async (userName: string) => {
  const user = await prisma.user.findFirst({
    where: {
      name: userName,
    },
  });

  if (!user) {
    throw new Error(`User with username ${userName} not found`);
  }
  const userId = await queryUserId(userName);

  return { user, userId };
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
