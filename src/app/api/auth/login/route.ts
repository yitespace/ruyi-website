import { NextResponse } from 'next/server';
import { login, logout, getSession } from '@/lib/auth';

// POST - 登录
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: '请输入密码' },
        { status: 400 }
      );
    }

    const success = await login(password);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: '密码错误' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: '登录失败' },
      { status: 500 }
    );
  }
}

// GET - 检查登录状态
export async function GET() {
  const session = await getSession();
  return NextResponse.json({
    success: true,
    isLoggedIn: !!session,
  });
}

// DELETE - 登出
export async function DELETE() {
  await logout();
  return NextResponse.json({ success: true });
}
