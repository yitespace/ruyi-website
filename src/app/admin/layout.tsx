export const dynamic = 'force-dynamic';

export const metadata = {
  title: '管理端 - 汝意的世界',
  description: '网站管理后台',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">⚙️ 管理后台</div>
        <nav className="admin-nav">
          <a href="/admin" className="admin-nav-item">📊 数据概览</a>
          <a href="/admin/messages" className="admin-nav-item">💬 留言审核</a>
          <a href="/admin/visitors" className="admin-nav-item">👥 访客数据</a>
          <a href="/admin/content" className="admin-nav-item">📝 内容编辑</a>
          <a href="/admin/settings" className="admin-nav-item">⚙️ 设置</a>
          <a href="/" className="admin-nav-item">🏠 返回首页</a>
        </nav>
      </aside>
      <div className="admin-content">{children}</div>
    </div>
  );
}
