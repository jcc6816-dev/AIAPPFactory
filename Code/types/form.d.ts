export type FormTheme = "minimal" | "business" | "dark" | "brutalism" | "retro";
export type LlmProvider = "openai" | "deepseek";
export type OcrProvider = "baidu" | "google" | "mock";
export type OcrTemplate =
  | "general_image"
  | "invoice"
  | "receipt"
  | "id_card";
export type OcrStatus =
  | "not_requested"
  | "uploaded"
  | "processing"
  | "completed"
  | "failed";
export type WebhookProvider =
  | "generic"
  | "feishu_bot"
  | "dingtalk_bot"
  | "wecom_bot";
export type WebhookAuthMode =
  | "none"
  | "keyword"
  | "query_keyword"
  | "header_keyword"
  | "body_keyword"
  | "signature";

export type FormFieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "date"
  | "select"
  | "radio"
  | "checkbox"
  | "file"
  | "image"
  | "pdf";

export interface FormFieldOption {
  label: string;
  value: string;
}

/**
 * 内置高保真 SVG 插画代号（8 套）
 * 用于 Split 双栏海报布局配图
 */
export type FormIllustrationKey =
  | "aurora-sphere"      // 极光球体 - 科技/AI/数据场景
  | "ai-planet-pass"    // 科技星球门票 - 会议/峰会/报名场景
  | "3d-emoji-nps"      // 3D 情绪微笑 - 满意度/NPS/反馈场景
  | "radar-scan"        // 雷达扫描 - 推荐/分析/智能场景
  | "cozy-calendar"     // 温馨书桌日历 - 预约/日程/咨询场景
  | "invoice-stack"     // 堆叠账单 - 发票/报销/财务场景
  | "terminal-log"      // 终端日志 - Bug反馈/开发者/技术场景
  | "waitlist-rocket";  // 火箭候补 - 候补名单/测试版/期待场景

export interface FormFieldSchema {
  key: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  help_text?: string;
  options?: FormFieldOption[];
  /** 字段级配图代号（可选） */
  image?: FormIllustrationKey;
  /** 字段级配图位置（可选） */
  imagePosition?: "left" | "right";
}

/** 表单视觉元数据 — 控制插画、版式和主题变体 */
export interface FormAspects {
  /** 欢迎页/封面配图代号 */
  welcomeImage?: FormIllustrationKey;
  /** 配图分栏位置 */
  welcomeImagePosition?: "left" | "right";
  /** 高级主题变体 */
  themeVariant?: "default" | "glass" | "gradient-flow";
  /** 默认倾向的预览设备模式 */
  preferredDevice?: "phone" | "desktop";
}

export interface FormSchema {
  fields: FormFieldSchema[];
  layout?: "single" | "long";
  /** 表单视觉元数据（插画、版式、主题变体） */
  aspects?: FormAspects;
}

export type FormAnswerValue = string | number | boolean | string[] | null;

export type FormAnswers = Record<string, FormAnswerValue>;

export interface SubmissionFileValue {
  field_key: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
}

export interface GenerationMeta {
  source?: "ai" | "fallback" | "template";
  provider?: LlmProvider;
  model?: string;
  prompt?: string;
  generated_at?: string;
}

export interface StoredFileAsset {
  field_key: string;
  file_name: string;
  file_path?: string;
  file_url?: string;
  mime_type?: string;
  file_size?: number;
  storage_provider?: string;
  storage_bucket?: string;
  uploaded_at?: string;
}

export interface OcrResultPayload {
  raw_text?: string;
  summary?: string;
  structured_data?: Record<string, any>;
  provider_payload?: Record<string, any>;
  processed_at?: string;
  processed_files?: string[];
}

export interface FormRecord {
  id?: number;
  uuid: string;
  user_uuid: string;
  title: string;
  description?: string;
  theme: FormTheme;
  schema_json: FormSchema;
  status: string;
  share_code: string;
  ocr_template?: OcrTemplate;
  llm_provider?: LlmProvider;
  llm_model?: string;
  generation_meta_json?: GenerationMeta;
  webhook_enabled?: boolean;
  webhook_url?: string;
  webhook_provider?: WebhookProvider;
  webhook_secret_encrypted?: string;
  webhook_auth_mode?: WebhookAuthMode;
  webhook_keyword_encrypted?: string;
  webhook_header_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateFormPayload {
  title: string;
  description?: string;
  theme?: FormTheme;
  schema: FormSchema;
  ocr_template?: OcrTemplate;
  generation?: GenerationMeta;
  webhook?: {
    enabled?: boolean;
    url?: string;
    provider?: WebhookProvider;
    secret?: string;
    auth_mode?: WebhookAuthMode;
    keyword?: string;
    header_name?: string;
  };
}

export interface GenerateFormPayload {
  prompt: string;
  theme?: FormTheme;
  provider?: LlmProvider;
  model?: string;
}

export interface GeneratedFormDraft {
  title: string;
  description: string;
  theme: FormTheme;
  schema: FormSchema;
  source: "ai" | "fallback" | "template";
  provider?: LlmProvider;
  model?: string;
  ocr_template?: OcrTemplate;
  webhook_provider?: WebhookProvider;
}

export interface FormSubmissionRecord {
  id?: number;
  uuid: string;
  form_uuid: string;
  form_title: string;
  form_share_code: string;
  answers_json: FormAnswers;
  files_json: SubmissionFileValue[];
  storage_files_json?: StoredFileAsset[];
  status: string;
  workflow_run_uuid?: string;
  ocr_status?: OcrStatus;
  ocr_provider?: OcrProvider | string;
  ocr_result_json?: OcrResultPayload;
  ocr_error_message?: string;
  created_at?: string;
}

export interface SubmitFormPayload {
  answers: FormAnswers;
  files?: SubmissionFileValue[];
  storage_files?: StoredFileAsset[];
}

export interface WebhookLogRecord {
  id?: number;
  uuid: string;
  form_uuid: string;
  submission_uuid: string;
  workflow_run_uuid?: string;
  target_url: string;
  request_body_json: Record<string, any>;
  response_status: number;
  response_body: string;
  attempt_count: number;
  status: string;
  error_message?: string;
  created_at?: string;
  last_attempt_at?: string;
}
