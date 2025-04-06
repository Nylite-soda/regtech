// app/not-found.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';

function NotFoundContent() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/"><Button>Go back to Home</Button></Link>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}