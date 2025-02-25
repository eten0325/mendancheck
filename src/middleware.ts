import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証が不要なパスを定義
const publicPaths = ['/login', '/auth/signup', '/auth/callback'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 現在のパスが公開パスかどうかをチェック
  const isPublicPath = publicPaths.some(path => req.nextUrl.pathname.startsWith(path));

  // 未認証ユーザーを処理
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 認証済みユーザーがログインページにアクセスした場合
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL('/mainmenu', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 