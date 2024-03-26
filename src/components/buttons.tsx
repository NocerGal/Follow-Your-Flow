'use client';

import { signIn, useSession } from 'next-auth/react';
import { ButtonHTMLAttributes } from 'react';

type ButtonProps = {
  children: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      onClick={() => signIn('github', { callbackUrl: '/flow/new' })}
    >
      {children}
    </button>
  );
}
