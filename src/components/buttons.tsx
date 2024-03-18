'use client';

import { signIn, useSession } from 'next-auth/react';

export default function Button() {
  // const { data: session, status } = useSession();
  // const userEmail = session?.user?.name;
  // console.log(userEmail);
  return <button onClick={() => signIn()}>Connect</button>;
}
