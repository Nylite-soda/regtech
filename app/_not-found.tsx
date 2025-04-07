// app/not-found.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';

function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">The page you are looking for does not exist.</p>
      <Link href="/">
        <Button>Go back to Home</Button>
      </Link>
    </div>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <NotFoundContent />
      </Suspense>
    </div>
  );
}