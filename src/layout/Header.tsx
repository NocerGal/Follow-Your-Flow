import React from 'react';
import AuthButton from '../faetures/auth/AuthButton';
import { ThemeToggle } from '../ThemeToggle';

export default function Header() {
  return (
    <header className="py-4 border-b-foreground border">
      <div className="flex justify-between items-center mx-auto max-w-6xl w-full px-4">
        <p>Logo</p>
        <nav className="flex items-center gap-4">
          <ThemeToggle />
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
