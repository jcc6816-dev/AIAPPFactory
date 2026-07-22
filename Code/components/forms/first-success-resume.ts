// 游客登录意图的自动恢复判定逻辑，抽成纯函数便于单元测试。
// 背景：游客点击“创建/发布”会被引导登录；回跳后此前只记录了埋点，
// 没有恢复用户已明确表达过的动作，导致回跳用户流失在“还要再点一次”。
// 这里集中定义“什么时候可以安全地自动恢复该动作”。

export interface GuestIntentLike {
  trigger?: string;
  stored_at?: number;
}

export interface AutoResumeInput {
  intent?: GuestIntentLike | null;
  isGuest: boolean;
  hasDraft: boolean;
  isSaving: boolean;
  now?: number;
  /** 意图有效期，默认 30 分钟；过期意图不应再自动写入 */
  maxAgeMs?: number;
}

const RESUMABLE_TRIGGERS = new Set(["create_form", "publish_form"]);
const DEFAULT_MAX_AGE_MS = 30 * 60 * 1000;

export function shouldAutoResumeGuestIntent({
  intent,
  isGuest,
  hasDraft,
  isSaving,
  now,
  maxAgeMs = DEFAULT_MAX_AGE_MS,
}: AutoResumeInput): boolean {
  if (!intent) return false;
  // 仍然是游客：还没有完成登录，不能恢复
  if (isGuest) return false;
  // 草稿未就绪：模板草稿是异步构建的，等它 ready 再恢复
  if (!hasDraft) return false;
  // 正在保存：避免重复提交
  if (isSaving) return false;
  // 只恢复用户明确点击过的创建/发布动作
  if (!intent.trigger || !RESUMABLE_TRIGGERS.has(intent.trigger)) return false;
  // 过期意图不自动写入：防止用户隔天回访时意外创建表单
  const storedAt = typeof intent.stored_at === "number" ? intent.stored_at : 0;
  const age = (now ?? Date.now()) - storedAt;
  if (storedAt <= 0 || age < 0 || age > maxAgeMs) return false;
  return true;
}

export interface ResumeAction {
  status: "draft" | "published";
  override: "create_form" | "publish_form";
}

export function resumeActionForTrigger(trigger?: string): ResumeAction | null {
  if (trigger === "create_form") {
    return { status: "draft", override: "create_form" };
  }
  if (trigger === "publish_form") {
    return { status: "published", override: "publish_form" };
  }
  return null;
}
