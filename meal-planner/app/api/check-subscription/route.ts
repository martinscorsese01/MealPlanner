import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ active: false });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { subscriptionActive: true },
  });

  return NextResponse.json({ active: profile?.subscriptionActive || false });
}