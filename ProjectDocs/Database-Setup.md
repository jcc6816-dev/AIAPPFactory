# MVP 数据库接入最小方案

更新时间：2026-05-08

## 结论

当前本地演示模式不强制需要数据库。

- 登录会使用本地 development session
- 表单草稿会写入 [Code/data/dev-forms.json](/Users/mike/Documents/AIFactory/Code/data/dev-forms.json)

如果你准备进入正式开发、联调或部署阶段，就需要接入数据库。结合当前代码底座，最顺手的方案是先用 Supabase。

## 当前阶段建议

### 本地看效果

不需要先部署数据库，只要：

- `npm run dev`
- 使用 `Development Sign In`

就可以先看登录、表单列表、新建页、详情页和分享页骨架。

### 进入正式开发

建议立即接入 Supabase，并优先完成：

1. 配置 `SUPABASE_URL`
2. 配置 `SUPABASE_ANON_KEY`
3. 配置 `SUPABASE_SERVICE_ROLE_KEY`
4. 执行 [Code/data/install.sql](/Users/mike/Documents/AIFactory/Code/data/install.sql)

## 环境变量

需要在 [Code/.env.local](/Users/mike/Documents/AIFactory/Code/.env.local) 中填写：

```env
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

如果你已经完成登录调试，也可以保留：

```env
AUTH_DEV_ENABLED="true"
NEXT_PUBLIC_AUTH_DEV_ENABLED="true"
```

等正式 OAuth 配好后再关闭。

## 首批需要的表

当前首批代码依赖这些表：

- `users`
- `orders`
- `apikeys`
- `credits`
- `posts`
- `affiliates`
- `forms`
- `form_submissions`

其中 `forms` 和 `form_submissions` 是当前这两轮新增的表，已经写在 [Code/data/install.sql](/Users/mike/Documents/AIFactory/Code/data/install.sql) 里。

## 本地开发兜底文件

如果你还没接 Supabase，本地开发模式会先写到：

- [Code/data/dev-forms.json](/Users/mike/Documents/AIFactory/Code/data/dev-forms.json)
- [Code/data/dev-form-submissions.json](/Users/mike/Documents/AIFactory/Code/data/dev-form-submissions.json)

## 推荐操作顺序

1. 在 Supabase 创建一个新项目
2. 打开 SQL Editor
3. 执行 [Code/data/install.sql](/Users/mike/Documents/AIFactory/Code/data/install.sql)
4. 将连接信息写入 [Code/.env.local](/Users/mike/Documents/AIFactory/Code/.env.local)
5. 重启本地开发服务

## 完成后你会得到什么

接入数据库后：

- 登录用户可以真正落库
- 表单草稿不再写本地 JSON，而是写入 `forms`
- 后续 `form_submissions / workflows / webhook_logs / usage_ledger` 扩展时可以直接接着往下做

## 当前不必急着做的事

现在还不需要为了首批页面效果去上：

- Prisma
- Redis
- 独立工作流引擎
- 多租户隔离

这些都可以等第二批、第三批功能再决定。
