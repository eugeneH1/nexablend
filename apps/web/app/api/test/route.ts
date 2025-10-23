import { NextResponse } from 'next/server';
import { db } from '@nexablend/db';

export async function GET() {
  const tenants = await db.tenant.findMany({ take: 1 });
  return NextResponse.json({ tenants });
}

