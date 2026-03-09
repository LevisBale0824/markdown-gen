/**
 * Tauri 命令类型定义 - 对齐 Rust commands.rs
 */

import type { AppConfig } from './config';

export interface FileInfo {
  name: string;
  path: string;
  is_dir: boolean;
}

export type AIAction = 'polish' | 'expand' | 'summarize' | 'tone';

/**
 * Tauri 命令接口
 */
export interface TauriCommands {
  open_file(path: string): Promise<string>;
  save_file(path: string, content: string): Promise<void>;
  read_directory(path: string): Promise<FileInfo[]>;
  create_file(path: string): Promise<void>;
  delete_file(path: string): Promise<void>;
  save_file_dialog(defaultName?: string): Promise<string | null>;
  ai_chat(message: string, context: string): Promise<string>;
  ai_suggest(text: string, action: AIAction): Promise<string>;
  get_config(): Promise<AppConfig>;
  save_config(config: AppConfig): Promise<void>;
  count_words(content: string): Promise<number>;
  count_chars(content: string): Promise<number>;
}

/**
 * Tauri invoke 函数类型
 */
export type InvokeFn = (cmd: string, args?: Record<string, unknown>) => Promise<unknown>;
