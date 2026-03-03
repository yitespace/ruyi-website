import { NextResponse } from 'next/server';
import { db } from '@/lib/kv';

// GET - 获取测试题目和博主答案
export async function GET() {
  try {
    // 尝试从 KV 获取自定义答案，如果没有则使用默认答案
    const customAnswers = await db.hgetall<string>('quiz:answers');

    return NextResponse.json({
      success: true,
      questions: await import('@/lib/quiz').then(m => m.questions),
      answers: customAnswers || null,
    });
  } catch (error) {
    console.error('Failed to fetch quiz data:', error);
    return NextResponse.json({
      success: true,
      questions: await import('@/lib/quiz').then(m => m.questions),
      answers: null,
    });
  }
}
