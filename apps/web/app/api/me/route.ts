import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@nexablend/db';

export async function GET() {
  const tenantId = "demo"; // DEV ONLY: replace with real tenant from auth later
  const mods = Array.from(await getEntitlements(tenantId));
  return Response.json({ tenantId, modules: mods });
}

