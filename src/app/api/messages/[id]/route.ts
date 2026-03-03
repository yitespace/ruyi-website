import { NextResponse } from 'next/server';
import { db } from '@/lib/kv';
import { getSession } from '@/lib/auth';

// PATCH - 审核留言（通过/拒绝）
export async function PATCH(request: Request) {
  try {
    // 检查登录状态
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json(
        { success: false, error: '参数错误' },
        { status: 400 }
      );
    }

    // 获取待审核留言
    const pending = await db.lrange<any>('messages:pending', 0, -1);
    const message = pending?.find((m) => m.id === id);

    if (!message) {
      return NextResponse.json(
        { success: false, error: '留言不存在' },
        { status: 404 }
      );
    }

    // 从待审核列表移除
    await db.lrem('messages:pending', 1, message);

    if (action === 'approve') {
      // 添加到已审核列表（最新的在前）
      await db.lpush('messages:approved', {
        ...message,
        reviewedAt: Date.now(),
      });
    } else if (action === 'reject') {
      // 添加到拒绝列表
      await db.lpush('messages:rejected', {
        ...message,
        rejectedAt: Date.now(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to review message:', error);
    return NextResponse.json(
      { success: false, error: '操作失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除留言
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const list = searchParams.get('list') || 'approved';

    if (!id) {
      return NextResponse.json(
        { success: false, error: '参数错误' },
        { status: 400 }
      );
    }

    // 获取对应列表的留言
    const messages = await db.lrange<any>(`messages:${list}`, 0, -1);
    const message = messages?.find((m) => m.id === id);

    if (!message) {
      return NextResponse.json(
        { success: false, error: '留言不存在' },
        { status: 404 }
      );
    }

    // 从列表移除
    await db.lrem(`messages:${list}`, 1, message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete message:', error);
    return NextResponse.json(
      { success: false, error: '删除失败' },
      { status: 500 }
    );
  }
}
