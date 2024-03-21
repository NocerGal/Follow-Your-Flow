import Link from 'next/link';

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-between h-full w-full p-24">
      <div className="text-center">
        <h1>Follow your Flow</h1>
        <h2>Create your and add your colaborators</h2>
      </div>
      <div>
        <Link href={'/flow/new'}>Create your flow!</Link>
      </div>
      <div className="flex flex-col">
        <div>DISPLAY RECENTS FLOW INFOS</div>
        <div>DISPLAY RECENTS FLOW INFOS</div>
        <div>DISPLAY RECENTS FLOW INFOS</div>
      </div>
    </main>
  );
}
