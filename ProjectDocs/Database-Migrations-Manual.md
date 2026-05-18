# 数据库增量补丁手册

更新时间：2026-05-10

## 适用范围

本文件用于说明在 `Code/data/install.sql` 之外，当前 MVP 迭代中已经新增过、但可能需要你手动补执行的数据库字段。

如果你是从最早版本一路迭代过来的 Supabase 项目，请执行下面这些增量 SQL。

## 1. Webhook 基础字段

```sql
alter table forms
  add column if not exists webhook_enabled boolean not null default false,
  add column if not exists webhook_url varchar(500) not null default '',
  add column if not exists webhook_secret_encrypted text not null default '';

alter table webhook_logs
  add column if not exists error_message text not null default '';
```

## 2. Webhook 高级/平台字段

```sql
alter table forms
  add column if not exists webhook_auth_mode varchar(50) not null default 'none',
  add column if not exists webhook_keyword_encrypted text not null default '',
  add column if not exists webhook_header_name varchar(255) not null default '',
  add column if not exists webhook_provider varchar(50) not null default 'generic';
```

## 3. LLM / OCR 预留字段

```sql
alter table forms
  add column if not exists ocr_template varchar(50) not null default 'general_image',
  add column if not exists llm_provider varchar(50) not null default '',
  add column if not exists llm_model varchar(100) not null default '',
  add column if not exists generation_meta_json jsonb not null default '{}'::jsonb;

alter table form_submissions
  add column if not exists storage_files_json jsonb not null default '[]'::jsonb,
  add column if not exists ocr_status varchar(50) not null default 'not_requested',
  add column if not exists ocr_provider varchar(50) not null default '',
  add column if not exists ocr_result_json jsonb not null default '{}'::jsonb,
  add column if not exists ocr_error_message text not null default '';
```

## 4. 推荐做法

如果是新环境：

1. 直接执行 [Code/data/install.sql](/Users/mike/Documents/AIFactory/Code/data/install.sql)

如果是旧环境：

1. 先执行本文件里的增量 SQL
2. 再重启本地服务

## 5. 当前核心表

当前 MVP 已实际使用这些表：

- `users`
- `orders`
- `apikeys`
- `credits`
- `forms`
- `form_submissions`
- `workflow_runs`
- `webhook_logs`

## 6. 连接检查

完成后建议做 3 个检查：

1. 登录一次，确认 `users / credits` 有新增
2. 创建一个表单，确认 `forms` 有新增
3. 提交一次分享页，确认 `form_submissions / workflow_runs / webhook_logs` 有新增

## 7. OCR 当前边界

- 当前 OCR 第一批接入的是 `百度 OCR` 和 `Google Vision OCR`
- 这一批以图片文件为主，`image/*` 会进入 OCR
- `PDF` 文件当前仍可上传和留痕，但不在这一批里做真实 OCR 解析

## 8. 开发态联调说明

以下不是数据库字段，但和本地联调稳定性直接相关：

- `DEV_FREE_FORM_LIMIT`
- `DEV_MIN_FORM_CREDITS`

当前建议：

- `DEV_FREE_FORM_LIMIT = "100"`
- `DEV_MIN_FORM_CREDITS = "20"`

说明：

- 非 `production` 环境下，系统会自动补齐测试 credits 到安全阈值
- 这样连续联调 OCR / Webhook 时，不会因为测试态 credits 用尽而被阻塞
