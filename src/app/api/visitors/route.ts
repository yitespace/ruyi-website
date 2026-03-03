import { NextResponse } from 'next/server';
import { db } from '@/lib/kv';
import { getSession } from '@/lib/auth';

// GET - 获取访客列表
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const visitors = await db.lrange<any>('visitors:list', 0, limit - 1);

    // 获取统计数据
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const allVisitors = await db.lrange<any>('visitors:list', 0, -1);
    const todayVisitors = allVisitors?.filter(
      (v) => v.visitedAt >= todayTimestamp
    ).length || 0;

    return NextResponse.json({
      success: true,
      visitors: visitors || [],
      stats: {
        total: allVisitors?.length || 0,
        today: todayVisitors,
      },
    });
  } catch (error) {
    console.error('Failed to fetch visitors:', error);
    return NextResponse.json(
      { success: false, error: '获取失败' },
      { status: 500 }
    );
  }
}

// POST - 记录访客（自动调用）
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ip, userAgent, compatibilityScore } = body;

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
