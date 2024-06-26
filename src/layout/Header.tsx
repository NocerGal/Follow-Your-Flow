import React from 'react';
import AuthButton from '../faetures/auth/AuthButton';
import { ThemeToggle } from '../ThemeToggle';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-4 border-b-foreground border">
      <div className="flex justify-between items-center mx-auto max-w-6xl w-full px-4">
        <Link href="/">Logo</Link>
        <nav className="flex items-center gap-4">
          <ThemeToggle />
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
