'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-page-bg flex flex-col items-center justify-center gap-6 px-4">
      <h2 className="text-white font-helvetica text-[32px] font-light">Something went wrong</h2>
      <button
        onClick={reset}
        className="text-primary font-helvetica text-base border border-primary px-6 py-2 hover:bg-primary hover:text-white transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
