import { NextResponse } from 'next/server';
import { db } from '@/lib/kv';
import { getClientIp } from '@/lib/ip';

// POST - 记录访客（自动调用）
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userAgent, compatibilityScore } = body;
    const ip = getClientIp();

    const visitor = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      ip,
      userAgent: userAgent || '',
      visitedAt: Date.now(),
      compatibilityScore,
    };

    await db.rpush('visitors:list', visitor);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to track visitor:', error);
    return NextResponse.json(
      { success: false, error: '记录失败' },
      { status: 500 }
    );
  }
}
