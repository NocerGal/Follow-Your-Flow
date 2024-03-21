'use client';

import { Session } from 'next-auth';
import React, { Suspense } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/components/ui/alert-dialog';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { ExitIcon, UpdateIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';

type LoggedInButtonPropsTypes = {
  user: Session['user'];
};

export default function LoggedInButton({ user }: LoggedInButtonPropsTypes) {
  const mutation = useMutation({ mutationFn: async () => signOut() });

  return (
    <DropdownMenu>
      <AlertDialog>
        <DropdownMenuTrigger>
          <Button variant="outline" className="py-6 px-2">
            <Avatar className="mr-2 h-10 w-10">
              {user.image ? (
                <AvatarImage
                  src={user.image}
                  alt={user.name ?? 'user picture'}
                ></AvatarImage>
              ) : (
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              )}
            </Avatar>

            {user.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Admins</DropdownMenuItem>
          <DropdownMenuItem>My Flows</DropdownMenuItem>
          <DropdownMenuSeparator />

          <AlertDialogTrigger asChild>
            <DropdownMenuItem>
              <ExitIcon className="mr-2" />
              Logout
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to logout?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Cancel</Button>
            </AlertDialogCancel>
            <Button variant="destructive" onClick={() => mutation.mutate()}>
              {mutation.isPending ? (
                <UpdateIcon className="animate-spin" />
              ) : (
                <ExitIcon className="mr-2" />
              )}
              Logout
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
}
