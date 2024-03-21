'use client';

import { Button } from '@/src/components/ui/button';
import { EnterIcon, UpdateIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import React from 'react';

export default function LogginButton() {
  const mutation = useMutation({ mutationFn: async () => signIn() });

  return (
    <Button onClick={() => mutation.mutate()}>
      {mutation.isPending ? (
        <UpdateIcon className="animate-spin mr-2" />
      ) : (
        <EnterIcon className="mr-2" />
      )}
      Login
    </Button>
  );
}
