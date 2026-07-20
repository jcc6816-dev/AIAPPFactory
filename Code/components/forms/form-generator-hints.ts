// 生成器输入区底部提示文案的纯逻辑，抽出来便于单元测试。
// 背景：/forms/new 对游客恒为 canCreate=false（游客不能保存），
// 若直接按 canCreate 显示“配额达到上限”，会对 100% 匿名访客误报升级提示。
export interface FormGeneratorFooterHintInput {
  isGuest: boolean;
  canCreate: boolean;
  isZh: boolean;
}

export function getGeneratorFooterHint({
  isGuest,
  canCreate,
  isZh,
}: FormGeneratorFooterHintInput): string {
  // 游客没有“配额”概念：真实状态是“登录后才能保存/发布”，而不是配额已满。
  if (isGuest) {
    return isZh ? "登录后可保存并发布表单" : "Sign in to save and publish your form";
  }
  if (canCreate) {
    return isZh ? "可创建并保存表单" : "Ready to create and save forms";
  }
  return isZh ? "配额达到上限 (请升级)" : "Quota limit reached (Please upgrade)";
}
