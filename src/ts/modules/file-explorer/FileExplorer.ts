/**
 * 文件浏览器模块
 */

import type { FileInfo } from '../../types';
import { tauriBridge } from '../../core';
import type { Editor } from '../editor';
import type { App } from '../app';

/**
 * 文件浏览器类
 */
export class FileExplorer {
  private fileTree: HTMLElement;
  private currentPath: string | null = null;
  private editor: Editor;
  private app: App;
  private unsubscribe: (() => void) | null = null;
  private expandedFolders: Set<string> = new Set();

  constructor(editor: Editor, app: App) {
    this.editor = editor;
    this.app = app;
    this.fileTree = document.getElementById('file-tree') as HTMLElement;
    this.init();
  }

  /**
   * 初始化
   */
  private async init(): Promise<void> {
    // 默认加载安装目录下的 notes 文件夹
    const defaultPath = await this.getDefaultPath();
    await this.loadDirectory(defaultPath);
  }

  /**
   * 渲染空状态提示
   */
  private renderEmpty(): void {
    this.fileTree.innerHTML = `
      <div class="px-4 py-8 text-center">
        <span class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">folder_open</span>
        <p class="text-sm text-slate-400 dark:text-slate-500">点击上方按钮打开文件夹</p>
      </div>
    `;
  }

  /**
   * 获取默认路径（安装目录下的 notes 文件夹）
   */
  private async getDefaultPath(): Promise<string> {
    try {
      const appDir = await tauriBridge.getAppDir();
      return appDir + '\\notes';
    } catch {
      return '.\\notes';
    }
  }

  /**
   * 启动文件监视
   */
  private async startWatching(path: string): Promise<void> {
    // 停止之前的监视
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    try {
      // 启动后端文件监视
      await tauriBridge.startFileWatcher(path);

      // 监听文件变更事件
      this.unsubscribe = tauriBridge.onFileChange((event) => {
        console.log('File change detected:', event);
        // 刷新目录
        if (this.currentPath) {
          this.loadDirectory(this.currentPath);
        }
      });
    } catch (error) {
      console.error('Failed to start file watcher:', error);
    }
  }

  /**
   * 加载目录
   */
  async loadDirectory(path: string): Promise<void> {
    try {
      const files = await tauriBridge.readDirectory(path);
      this.renderFileTree(files);
      this.currentPath = path;

      // 启动文件监视
      this.startWatching(path);
    } catch (error) {
      console.error('Failed to load directory:', error);
      this.renderError('Failed to load directory');
    }
  }

  /**
   * 渲染文件树
   */
  private renderFileTree(files: FileInfo[]): void {
    this.fileTree.innerHTML = '';

    if (files.length === 0) {
      this.fileTree.innerHTML = '<div class="px-4 py-2 text-sm text-slate-400 dark:text-slate-500">空文件夹</div>';
      return;
    }

    // 排序：文件夹在前，然后按名称排序
    const sortedFiles = [...files].sort((a, b) => {
      if (a.is_dir && !b.is_dir) return -1;
      if (!a.is_dir && b.is_dir) return 1;
      return a.name.localeCompare(b.name);
    });

    sortedFiles.forEach(file => {
      const item = this.createFileItem(file, 0);
      this.fileTree.appendChild(item);
    });
  }

  /**
   * 创建文件项（支持嵌套）
   */
  private createFileItem(file: FileInfo, level: number): HTMLElement {
    const item = document.createElement('div');
    item.className = 'file-item-wrapper';

    const row = document.createElement('div');
    row.className = 'file-item flex items-center gap-1 px-2 py-1.5 text-sm rounded-lg cursor-pointer';
    row.style.paddingLeft = `${level * 16 + 8}px`;

    if (file.is_dir) {
      const isExpanded = this.expandedFolders.has(file.path);
      row.classList.add('font-medium', 'text-slate-700', 'dark:text-slate-300', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
      row.innerHTML = `
        <span class="material-symbols-outlined text-sm text-slate-400 dark:text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}" data-chevron>${isExpanded ? 'chevron_right' : 'chevron_right'}</span>
        <span class="material-symbols-outlined text-slate-400 dark:text-slate-500" data-folder-icon>${isExpanded ? 'folder_open' : 'folder'}</span>
        <span class="truncate">${file.name}</span>
      `;

      // 子文件夹容器
      const childrenContainer = document.createElement('div');
      childrenContainer.className = 'folder-children';
      childrenContainer.style.display = isExpanded ? 'block' : 'none';

      // 点击展开/折叠
      row.addEventListener('click', async () => {
        if (this.expandedFolders.has(file.path)) {
          // 折叠
          this.expandedFolders.delete(file.path);
          childrenContainer.style.display = 'none';
          const chevron = row.querySelector('[data-chevron]') as HTMLElement;
          const folderIcon = row.querySelector('[data-folder-icon]') as HTMLElement;
          if (chevron) chevron.classList.remove('rotate-90');
          if (folderIcon) folderIcon.textContent = 'folder';
        } else {
          // 展开
          this.expandedFolders.add(file.path);
          childrenContainer.style.display = 'block';
          const chevron = row.querySelector('[data-chevron]') as HTMLElement;
          const folderIcon = row.querySelector('[data-folder-icon]') as HTMLElement;
          if (chevron) chevron.classList.add('rotate-90');
          if (folderIcon) folderIcon.textContent = 'folder_open';

          // 懒加载子文件夹内容
          if (childrenContainer.children.length === 0) {
            try {
              const children = await tauriBridge.readDirectory(file.path);
              const sortedChildren = [...children].sort((a, b) => {
                if (a.is_dir && !b.is_dir) return -1;
                if (!a.is_dir && b.is_dir) return 1;
                return a.name.localeCompare(b.name);
              });
              sortedChildren.forEach(child => {
                childrenContainer.appendChild(this.createFileItem(child, level + 1));
              });
            } catch (error) {
              console.error('Failed to load subdirectory:', error);
            }
          }
        }
      });

      item.appendChild(row);
      item.appendChild(childrenContainer);
    } else {
      row.classList.add('text-slate-600', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
      row.innerHTML = `
        <span class="w-4"></span>
        <span class="material-symbols-outlined text-sm text-slate-400 dark:text-slate-500">description</span>
        <span class="truncate">${file.name}</span>
      `;

      // 单击打开文件
      row.addEventListener('click', () => this.openFile(file.path, row));

      item.appendChild(row);
    }

    return item;
  }

  /**
   * 打开文件
   */
  async openFile(path: string, row?: HTMLElement): Promise<void> {
    try {
      const content = await tauriBridge.openFile(path);
      this.editor.setContent(content);
      this.app.setCurrentFile(path);
      this.app.updateFileName(path);

      // 高亮当前文件
      document.querySelectorAll('.file-item').forEach(el => el.classList.remove('active'));
      if (row) {
        row.classList.add('active');
      }
    } catch (error) {
      console.error('Failed to open file:', error);
      alert('Failed to open file: ' + error);
    }
  }

  /**
   * 创建新文件
   */
  async createNewFile(): Promise<void> {
    try {
      const fileName = prompt('输入文件名:', 'untitled.md');
      if (!fileName) return;

      const savePath = (this.currentPath || '.') + '\\' + fileName;

      // 创建空文件
      await tauriBridge.createFile(savePath);
      // 打开新文件
      await this.openFile(savePath);
      // 刷新目录
      if (this.currentPath) {
        await this.loadDirectory(this.currentPath);
      }
    } catch (error) {
      console.error('Failed to create file:', error);
      alert('Failed to create file: ' + error);
    }
  }

  /**
   * 渲染错误
   */
  private renderError(message: string): void {
    this.fileTree.innerHTML = `
      <div class="px-4 py-2 text-sm text-red-400 dark:text-red-500">
        ${message}
      </div>
    `;
  }
}
