import { NextResponse } from 'next/server';
import { calculateScore, getScoreMessage, questions } from '@/lib/quiz';
import { db } from '@/lib/kv';
import { getClientIp } from '@/lib/ip';
import { generateId } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { success: false, error: '答案格式错误' },
        { status: 400 }
      );
    }

    // 验证答案完整性
    for (const q of questions) {
      if (!answers[q.id]) {
        return NextResponse.json(
          { success: false, error: '请回答所有问题' },
          { status: 400 }
        );
      }
    }

    // 计算分数
    const score = calculateScore(answers);
    const message = getScoreMessage(score);

    // 记录访客（带契合度分数）
    const ip = getClientIp();
    const visitorId = generateId();

    await db.rpush('visitors:list', {
      id: visitorId,
      ip: ip,
      userAgent: request.headers.get('user-agent') || '',
      visitedAt: Date.now(),
      compatibilityScore: score,
    });

    return NextResponse.json({
      success: true,
      score,
      message,
    });
  } catch (error) {
    console.error('Failed to submit quiz:', error);
    return NextResponse.json(
      { success: false, error: '提交失败，请重试' },
      { status: 500 }
    );
  }
}
