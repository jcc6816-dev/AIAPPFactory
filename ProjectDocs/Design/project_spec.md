# 📦 project_spec.md（MVP平台内核 + 报销场景｜Codex最终可执行版）

---

# 1. 项目名称

```text
AI Minimal Automation Platform (MVP)
```

---

# 2. 项目目标

构建一个**最小可运行自动化平台内核**，并实现一个“报销场景”作为示例。

---

## 🎯 最终能力

系统必须可以：

1. 创建一个 Scene（场景）
2. 定义 Form（表单结构）
3. 执行 Workflow（顺序流程）
4. 调用 Skill（OCR / save / notify）
5. 完成报销闭环流程

---

# 3. 强约束（非常重要）

❗Codex必须遵守：

* 不做多租户
* 不做权限系统
* 不做AI Agent对话系统
* 不做可视化编辑器
* 不做分支/并发workflow
* 不拆微服务
* 不引入复杂架构（MQ / k8s / event bus）

---

> ✔ 目标：单体可运行系统（Monolith MVP）

---

# 4. 技术栈

---

## Backend

* Node.js 18+
* Express
* SQLite（better-sqlite3）

---

## Frontend

* React + Vite
* Axios

---

# 5. 系统架构（最简）

```text
Frontend (React)
   ↓
API Server (Express)
   ↓
Scene Engine
   ↓
Workflow Engine
   ↓
Skill Executor
   ↓
SQLite
```

---

# 6. 核心概念（必须实现）

---

## 6.1 Scene（场景）

```json
{
  "id": "reimburse_scene",
  "name": "报销流程",
  "form_schema": {
    "fields": [
      { "name": "user_name", "type": "text" },
      { "name": "invoice", "type": "image", "ocr": true }
    ]
  },
  "workflow": [
    { "type": "ocr" },
    { "type": "save" },
    { "type": "notify" }
  ]
}
```

---

## 6.2 Form Schema（表单）

支持字段：

* text
* number
* image

---

## 6.3 Workflow（顺序执行）

只支持：

```text
linear execution (no branch)
```

---

## 6.4 Skill（能力节点）

必须实现 3 个：

### OCR Skill（模拟）

```js
function ocr(image) {
  return {
    amount: 120,
    date: "2026-01-01"
  }
}
```

---

### SAVE Skill

```js
insert into expenses
```

---

### NOTIFY Skill

```js
console.log("approval sent")
```

---

# 7. 数据库设计（SQLite）

---

## 7.1 scenes

```sql
CREATE TABLE scenes (
  id TEXT PRIMARY KEY,
  name TEXT,
  form_schema TEXT,
  workflow TEXT
);
```

---

## 7.2 expenses

```sql
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  user_name TEXT,
  amount REAL,
  date TEXT,
  invoice_url TEXT,
  status TEXT
);
```

---

## 7.3 logs

```sql
CREATE TABLE logs (
  id TEXT PRIMARY KEY,
  scene_id TEXT,
  node TEXT,
  status TEXT,
  result TEXT,
  created_at TEXT
);
```

---

# 8. API设计

---

## 8.1 创建场景

```http
POST /api/scenes
```

---

## 8.2 获取场景

```http
GET /api/scenes/:id
```

---

## 8.3 提交报销

```http
POST /api/expense/submit
```

---

## 8.4 执行 workflow（核心）

```http
POST /api/workflow/run
```

---

# 9. Workflow Engine（核心逻辑）

---

## 执行规则

```js
for (const node of workflow) {
  execute(node)
  log(node)
}
```

---

## 节点执行规则

| type   | action      |
| ------ | ----------- |
| ocr    | mock OCR    |
| save   | insert DB   |
| notify | console log |

---

# 10. 报销业务流程（必须实现）

---

```text
用户上传发票
→ OCR识别金额
→ 自动填表
→ 提交 workflow
→ 保存数据库
→ 通知完成
```

---

# 11. 前端页面（最小实现）

---

## 页面1：报销提交页

功能：

* 上传图片
* 自动填充OCR结果
* 提交按钮

---

## 页面2：记录列表页

* 展示 expenses
* 查看状态

---

# 12. OCR（必须Mock）

---

```js
function mockOCR(imageUrl) {
  return {
    amount: 100,
    date: "2026-05-01"
  }
}
```

---

# 13. MVP验收标准（必须全部满足）

---

系统必须能：

✔ 创建场景
✔ 上传发票
✔ OCR返回数据
✔ 自动生成报销记录
✔ workflow顺序执行
✔ 数据入库成功
✔ 前端可查看结果

---

# 14. 禁止行为（强约束）

---

Codex不得实现：

❌ AI Agent系统
❌ 多租户
❌ 权限系统
❌ 复杂流程编排
❌ 分支/并发workflow
❌ 微服务架构
❌ 消息队列
❌ 插件系统

---

# 15. 项目结构（建议）

```text
/project
  /backend
    app.js
    db.js
    routes/
    engine/
      workflow.js
      skill.js
    services/
      ocr.js
  /frontend
    src/
      pages/
      api/
      components/
```

---

# 16. 设计核心思想（必须理解）

---

## ❗这一阶段不是平台

而是：

> **“用报销场景反推平台内核”**

---

# 17. 未来扩展路径（仅概念，不实现）

---

当MVP跑通后，可以扩展：

* Scene → 多场景平台
* Skill → 插件系统
* Workflow → 分支系统
* logs → 异常中心
* OCR → AI能力层

---

# 🚀 最终一句话定义

---

> This is a Minimal Automation Platform with a Reimbursement Vertical Slice.

---
