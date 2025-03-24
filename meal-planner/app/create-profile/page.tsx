'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProfile() {
  const router = useRouter();

  useEffect(() => {
    const create = async () => {
      await fetch('/api/create-profile', { method: 'POST' });
      router.push('/subscribe'); // after creating profile
    };

    create();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Creating your profile...</p>
    </div>
  );
}
