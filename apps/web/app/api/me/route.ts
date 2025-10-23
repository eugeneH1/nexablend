import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@nexablend/db';

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id, isPrimary: true },
    include: {
      tenant: true,
      tenant: { include: { entitlements: { include: { module: true } } } },
    },
  });

  return NextResponse.json({
    user: session.user,
    role: membership?.role ?? null,
    tenant: membership?.tenant,
    entitlements: membership?.tenant.entitlements ?? [],
  });
}


