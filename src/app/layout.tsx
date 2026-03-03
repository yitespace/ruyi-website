import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '欢迎来到汝意的世界 ✨',
  description: '汝意的个人主页 - 一个热爱生活、充满好奇心的女孩分享生活的小天地',
  keywords: ['汝意', '个人主页', '博客', '生活分享'],
  authors: [{ name: 'ruyi' }],
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
  themeColor: '#667eea',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '汝意的世界',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
