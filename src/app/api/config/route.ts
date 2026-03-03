import { NextResponse } from 'next/server';
import { db } from '@/lib/kv';
import { getSession } from '@/lib/auth';

// GET - 获取站点配置
export async function GET() {
  try {
    const config = await db.hgetall<any>('site:config');

    return NextResponse.json({
      success: true,
      config: config || null,
    });
  } catch (error) {
    console.error('Failed to fetch config:', error);
    return NextResponse.json({
      success: true,
      config: null,
    });
  }
}

// PUT - 更新站点配置
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { config } = body;

    if (!config || typeof config !== 'object') {
      return NextResponse.json(
        { success: false, error: '配置格式错误' },
        { status: 400 }
      );
    }

    await db.hset('site:config', config);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update config:', error);
    return NextResponse.json(
      { success: false, error: '更新失败' },
      { status: 500 }
    );
  }
}
