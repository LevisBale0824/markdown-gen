/**
 * Tauri API 统一封装
 * 自动检测环境，提供一致的 API 调用方式
 */

import type { AppConfig, FileInfo, AIAction, InvokeFn } from '../types';

class TauriBridgeImpl {
  private invoke: InvokeFn | null = null;
  private ready: Promise<void>;

  constructor() {
    this.ready = this.init();
  }

  private async init(): Promise<void> {
    if (typeof window !== 'undefined' && '__TAURI__' in window) {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        this.invoke = invoke;
      } catch (e) {
        console.warn('Tauri API not available, running in browser mode');
      }
    }
  }

  /**
   * 调用 Tauri 命令
   */
  async call<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
    await this.ready;
    if (!this.invoke) {
      throw new Error('Tauri API not available. Running in browser mode?');
    }
    return this.invoke(cmd, args) as Promise<T>;
  }

  /**
   * 检查 Tauri 是否可用
   */
  get available(): boolean {
    return this.invoke !== null;
  }

  // ========== 应用操作 ==========

  async getAppDir(): Promise<string> {
    return this.call<string>('get_app_dir');
  }

  async startFileWatcher(path: string): Promise<void> {
    return this.call<void>('start_file_watcher', { path });
  }

  /**
   * 监听文件变更事件
   */
  onFileChange(callback: (event: { kind: string; paths: string[] }) => void): () => void {
    if (!this.available) {
      return () => {};
    }

    let unlisten: (() => void) | null = null;

    import('@tauri-apps/api/event').then(({ listen }) => {
      listen<{ kind: string; paths: string[] }>('file-change', (event) => {
        callback(event.payload);
      }).then((fn) => {
        unlisten = fn;
      });
    });

    return () => {
      if (unlisten) unlisten();
    };
  }

  // ========== 文件操作 ==========

  async openFile(path: string): Promise<string> {
    return this.call<string>('open_file', { path });
  }

  async saveFile(path: string, content: string): Promise<void> {
    return this.call<void>('save_file', { path, content });
  }

  async readDirectory(path: string): Promise<FileInfo[]> {
    return this.call<FileInfo[]>('read_directory', { path });
  }

  async createFile(path: string): Promise<void> {
    return this.call<void>('create_file', { path });
  }

  async deleteFile(path: string): Promise<void> {
    return this.call<void>('delete_file', { path });
  }

  async saveFileDialog(defaultName?: string): Promise<string | null> {
    return this.call<string | null>('save_file_dialog', { defaultName });
  }

  async openFolderDialog(): Promise<string | null> {
    return this.call<string | null>('open_folder_dialog');
  }

  // ========== AI 操作 ==========

  async aiChat(message: string, context: string): Promise<string> {
    return this.call<string>('ai_chat', { message, context });
  }

  async aiSuggest(text: string, action: AIAction): Promise<string> {
    return this.call<string>('ai_suggest', { text, action });
  }

  // ========== 配置操作 ==========

  async getConfig(): Promise<AppConfig> {
    return this.call<AppConfig>('get_config');
  }

  async saveConfig(config: AppConfig): Promise<void> {
    return this.call<void>('save_config', { config });
  }

  // ========== 统计操作 ==========

  async countWords(content: string): Promise<number> {
    return this.call<number>('count_words', { content });
  }

  async countChars(content: string): Promise<number> {
    return this.call<number>('count_chars', { content });
  }
}

export const tauriBridge = new TauriBridgeImpl();
export type { TauriBridgeImpl };
