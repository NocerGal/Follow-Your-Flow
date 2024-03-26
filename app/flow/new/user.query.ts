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
