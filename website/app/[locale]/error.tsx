'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);

    // Chunk loading failures (CDN cold start, network blip) show "Something went wrong"
    // on first load and clear on refresh. Auto-reload up to 3 times so users never see this.
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      Boolean(error?.message?.match(/loading chunk|failed to fetch dynamically imported|dynamically imported module/i));

    if (isChunkError) {
      try {
        const count = Number(sessionStorage.getItem('_chunk_reload') ?? 0);
        if (count < 3) {
          sessionStorage.setItem('_chunk_reload', String(count + 1));
          window.location.reload();
        } else {
          sessionStorage.removeItem('_chunk_reload');
        }
      } catch {
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <main
      className="min-h-screen bg-page-bg flex flex-col items-center justify-center gap-6 px-4"
      style={{ background: '#101010', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '0 1rem' }}
    >
      <h2
        className="text-white font-helvetica text-[32px] font-light"
        style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 300, margin: 0 }}
      >
        Something went wrong
      </h2>
      <button
        onClick={reset}
        className="text-primary font-helvetica text-base border border-primary px-6 py-2 hover:bg-primary hover:text-white transition-colors"
        style={{ color: '#eb0028', border: '1px solid #eb0028', padding: '0.5rem 1.5rem', background: 'transparent', cursor: 'pointer', fontSize: '1rem' }}
      >
        Try again
      </button>
    </main>
  );
}
