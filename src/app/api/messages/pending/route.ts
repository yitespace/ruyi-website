import { NextResponse } from 'next/server';
import { db } from '@/lib/kv';
import { getSession } from '@/lib/auth';

// GET - 获取待审核留言（管理端专用）
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const pending = await db.lrange<any>('messages:pending', 0, -1);

    return NextResponse.json({
      success: true,
      messages: pending || [],
    });
  } catch (error) {
    console.error('Failed to fetch pending messages:', error);
    return NextResponse.json({
      success: true,
      messages: [],
    });
  }
}
