'use client';

import { signIn, useSession } from 'next-auth/react';

// Button clientSide to connect to the user's account

export default function Button() {
  return <button onClick={() => signIn()}>Connect</button>;
}
