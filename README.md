# 汝意个人网站 - Next.js 重构版

## 部署指南

### 1. 环境配置

在 Vercel 项目中，需要配置以下环境变量：

```bash
# Vercel KV 配置（连接 KV 数据库后自动设置）
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...

# 管理员密码
ADMIN_PASSWORD=your_secure_password
```

### 2. 部署步骤

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Next.js 重构完成"
   git push origin main
   ```

2. **在 Vercel 导入项目**
   - 登录 Vercel (vercel.com)
   - 点击 "Add New Project"
   - 选择 GitHub 仓库
   - 点击 "Deploy"

3. **连接 Vercel KV**
   - 在项目设置中，点击 "Storage"
   - 创建新的 KV 数据库
   - 环境变量会自动配置

### 3. 路由说明

#### 前台页面
| 路由 | 说明 |
|------|------|
| `/` | 首页 |
| `/quiz` | 契合度测试 |
| `/quiz/result/:score` | 测试结果 |
| `/messages` | 留言墙 |

#### 管理端页面
| 路由 | 说明 |
|------|------|
| `/admin/login` | 管理员登录 |
| `/admin` | 数据概览 |
| `/admin/messages` | 留言审核 |
| `/admin/visitors` | 访客数据 |
| `/admin/content` | 内容编辑 |
| `/admin/settings` | 设置 |

### 4. 默认管理员密码

在 `.env.local` 或 Vercel 环境变量中设置：
```
ADMIN_PASSWORD=ruyi2026
```

### 5. 数据结构 (Vercel KV)

```
messages:pending    - 待审核留言
messages:approved   - 已通过留言
messages:rejected   - 已拒绝留言
banned:ips          - IP 封禁列表
ip:count:{IP}       - IP 提交计数（24 小时过期）
visitors:list       - 访客记录
site:config         - 站点配置
quiz:answers        - 契合度测试答案
```

### 6. 本地开发

```bash
# 安装依赖
npm install

# 创建本地环境变量
cp .env.example .env.local

# 运行开发服务器
npm run dev

# 构建
npm run build

# 生产环境运行
npm start
```

### 7. 注意事项

- 留言提交有 IP 频率限制（24 小时内最多 5 条）
- IP 封禁功能可以防止恶意提交
- 管理端页面有会话保护，需要登录访问
- 所有数据存储在 Vercel KV，无需额外数据库

### 8. 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **数据库**: Vercel KV (Redis)
- **部署**: Vercel
