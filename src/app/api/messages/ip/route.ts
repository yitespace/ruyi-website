import { NextResponse } from 'next/server';
import { db } from '@/lib/kv';
import { getSession } from '@/lib/auth';

// POST - 封禁/解封 IP
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ip, action } = body;

    if (!ip || !action) {
      return NextResponse.json(
        { success: false, error: '参数错误' },
        { status: 400 }
      );
    }

    if (action === 'ban') {
      await db.sadd('banned:ips', ip);
    } else if (action === 'unban') {
      await db.srem('banned:ips', ip);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to ban/unban IP:', error);
    return NextResponse.json(
      { success: false, error: '操作失败' },
      { status: 500 }
    );
  }
}
