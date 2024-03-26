import Button from '@/src/components/buttons';
import { getRequiredAuthSession } from '@/src/lib/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await getRequiredAuthSession();

  return (
    <main className="flex flex-col items-center justify-between h-full w-full p-24">
      <div className="text-center">
        <h1>Follow your Flow</h1>
        <h2>Create your and add your colaborators</h2>
      </div>
      {/* Display diffents button if user is connected or not. One to connect and redirect to create new flow and one to directly go to create new flow */}
      {session.user ? (
        <Link
          href={'/flow/new'}
          className="bg-foreground text-background rounded-lg p-2 cursor-pointer"
        >
          Create your flow!
        </Link>
      ) : (
        <Button className="bg-foreground text-background rounded-lg p-2 cursor-pointer">
          Create your flow!
        </Button>
      )}

      <div className="flex flex-col">
        <div>DISPLAY RECENTS FLOW INFOS</div>
        <div>DISPLAY RECENTS FLOW INFOS</div>
        <div>DISPLAY RECENTS FLOW INFOS</div>
      </div>
    </main>
  );
}
