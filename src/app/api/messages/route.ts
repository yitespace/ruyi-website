import { NextResponse } from 'next/server';
import { db } from '@/lib/kv';
import { getClientIp } from '@/lib/ip';
import { generateId } from '@/lib/utils';

// GET - 获取已审核的留言
export async function GET() {
  try {
    const approved = await db.lrange<any>('messages:approved', 0, -1);
    return NextResponse.json({
      success: true,
      messages: approved || [],
    });
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({
      success: true,
      messages: [],
    });
  }
}

// POST - 提交新留言
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, content, avatar } = body;

    if (!name || !content) {
      return NextResponse.json(
        { success: false, error: '请填写昵称和留言内容' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { success: false, error: '留言内容不能超过 500 字' },
        { status: 400 }
      );
    }

    const ip = getClientIp();

    // 检查 IP 是否被封禁
    const isBanned = await db.sismember('banned:ips', ip);
    if (isBanned) {
      return NextResponse.json(
        { success: false, error: '您的 IP 已被封禁' },
        { status: 403 }
      );
    }

    // 检查 IP 提交频率（24 小时内最多 5 条）
    const ipCountKey = `ip:count:${ip}`;
    const count = await db.get<number>(ipCountKey);

    if (count && count >= 5) {
      return NextResponse.json(
        { success: false, error: '您今天的留言次数已达上限' },
        { status: 429 }
      );
    }

    // 创建留言
    const message = {
      id: generateId(),
      name: name.slice(0, 20),
      content,
      ip,
      avatar: avatar || `https://api.dicebear.com/7.x/miniavs/svg?seed=${generateId()}`,
      createdAt: Date.now(),
    };

    // 添加到待审核列表
    await db.rpush('messages:pending', message);

    // 增加 IP 计数（24 小时过期）
    const newCount = await db.incr(ipCountKey);
    if (newCount === 1) {
      await db.expire(ipCountKey, 24 * 60 * 60);
    }

    return NextResponse.json({
      success: true,
      message: '留言已提交，请等待审核',
    });
  } catch (error) {
    console.error('Failed to submit message:', error);
    return NextResponse.json(
      { success: false, error: '提交失败，请重试' },
      { status: 500 }
    );
  }
}
