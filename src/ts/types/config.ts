/**
 * 配置类型定义 - 对齐 Rust config.rs
 */

export interface AiConfig {
  provider: string;
  api_key: string;
  api_endpoint: string;
  model: string;
  max_tokens: number;
}

export interface AppConfig {
  ai: AiConfig;
  theme: string;
  last_path: string;
}

export type ThemeType = 'light' | 'dark' | 'custom';

export interface CustomTheme {
  enabled: boolean;
  name: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  codeBackgroundColor: string;
  secondaryBackgroundColor: string;
  mutedTextColor: string;
}

export interface AppSettings extends AppConfig {
  language: 'zh' | 'en';
  customTheme: CustomTheme;
}

export const DEFAULT_AI_CONFIG: AiConfig = {
  provider: 'glm',
  api_key: '',
  api_endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  model: 'glm-4-flash',
  max_tokens: 4096,
};

export const DEFAULT_APP_CONFIG: AppConfig = {
  ai: DEFAULT_AI_CONFIG,
  theme: 'dark',
  last_path: '',
};

export const DEFAULT_CUSTOM_THEME: CustomTheme = {
  enabled: false,
  name: 'Custom',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  accentColor: '#2563eb',
  borderColor: '#e5e7eb',
  codeBackgroundColor: '#f3f4f6',
  secondaryBackgroundColor: '#f9fafb',
  mutedTextColor: '#6b7280',
};
