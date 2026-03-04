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
      <div className="admin-content">{children}</div>
      <nav className="admin-bottom-nav">
        <a href="/admin" className="admin-nav-item">
          <span className="nav-icon">📊</span>
          <span className="nav-label">概览</span>
        </a>
        <a href="/admin/messages" className="admin-nav-item">
          <span className="nav-icon">💬</span>
          <span className="nav-label">留言</span>
        </a>
        <a href="/admin/visitors" className="admin-nav-item">
          <span className="nav-icon">👥</span>
          <span className="nav-label">访客</span>
        </a>
        <a href="/admin/content" className="admin-nav-item">
          <span className="nav-icon">📝</span>
          <span className="nav-label">编辑</span>
        </a>
        <a href="/admin/settings" className="admin-nav-item">
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">设置</span>
        </a>
      </nav>
    </div>
  );
}
