/**
 * Markdown 编辑器模块 - 左侧编辑，右侧实时预览
 */

import type { FormatType } from '../../types';
import { tauriBridge } from '../../core';

// 声明全局 marked
declare global {
  interface Window {
    marked?: {
      parse: (md: string) => string;
    };
    hljs?: {
      highlightAll: () => void;
    };
  }
}

/**
 * 视图模式类型
 */
type ViewMode = 'edit' | 'split' | 'preview';

/**
 * Markdown 解析函数
 */
const parseMarkdown = (md: string): string => {
  if (typeof window.marked !== 'undefined') {
    return window.marked.parse(md);
  }
  // 简易解析备用
  return simpleMarkdownParse(md);
};

/**
 * 简易 Markdown 解析（备用）
 */
function simpleMarkdownParse(md: string): string {
  let html = md;

  // 代码块（必须先处理）
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 标题
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // 粗体和斜体
  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

  // 图片和链接
  html = html.replace(/!\[([^\]]+)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1">');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

  // 引用
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

  // 无序列表
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // 有序列表
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

  // 段落
  const lines = html.split('\n\n');
  html = lines.map(line => {
    if (line.trim() &&
        !line.startsWith('<h') &&
        !line.startsWith('<ul') &&
        !line.startsWith('<ol') &&
        !line.startsWith('<blockquote') &&
        !line.startsWith('<pre') &&
        !line.startsWith('<li')) {
      return `<p>${line}</p>`;
    }
    return line;
  }).join('\n');

  // 换行
  html = html.replace(/\n/g, '<br>');

  return html;
}

/**
 * 内容变化回调类型
 */
type ContentChangedCallback = () => void;

/**
 * 编辑器类 - 左侧编辑，右侧实时预览
 */
export class Editor {
  private editor: HTMLTextAreaElement;
  private preview: HTMLElement;
  private editorContainer: HTMLElement;
  private previewContainer: HTMLElement;
  private viewMode: ViewMode = 'split';
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private selectedText: string | null = null;
  private contentChangedCallback: ContentChangedCallback | null = null;
  private saveFileCallback: ContentChangedCallback | null = null;

  constructor() {
    this.editor = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    this.preview = document.getElementById('markdown-preview') as HTMLElement;
    this.editorContainer = document.getElementById('editor-container') as HTMLElement;
    this.previewContainer = document.getElementById('preview-container') as HTMLElement;
    this.init();
  }

  /**
   * 设置内容变化回调
   */
  onContentChanged(callback: ContentChangedCallback): void {
    this.contentChangedCallback = callback;
  }

  /**
   * 设置保存文件回调
   */
  onSaveFile(callback: ContentChangedCallback): void {
    this.saveFileCallback = callback;
  }

  /**
   * 初始化编辑器
   */
  private init(): void {
    // 监听输入变化 - 实时更新预览
    this.editor.addEventListener('input', () => {
      this.schedulePreviewUpdate();
      this.updateStats();
      this.notifyContentChanged();
    });

    // 监听选择变化
    document.addEventListener('selectionchange', () => {
      this.handleSelectionChange();
    });

    // Tab 键支持
    this.editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        this.editor.value = this.editor.value.substring(0, start) + '  ' + this.editor.value.substring(end);
        this.editor.selectionStart = this.editor.selectionEnd = start + 2;
        this.schedulePreviewUpdate();
      }
    });

    // 设置默认视图模式
    this.setViewMode('split');

    // 初始化默认内容
    this.setContent(`# Welcome to Markdown Studio Pro

This is a powerful Markdown editor with AI assistance.

## Features

- **Real-time preview** - See your rendered Markdown on the right
- **AI Assistant** - Get help with writing, editing, and more
- **File explorer** - Manage your documents easily
- **Dark/Light theme** - Easy on the eyes

## Getting Started

1. Start typing or open an existing file
2. Use the toolbar buttons for quick formatting
3. Ask AI for help with your writing!

## Example Code

\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

> "The best way to predict the future is to create it." - Peter Drucker

Enjoy writing!
`);
  }

  /**
   * 设置视图模式
   */
  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;

    // 更新按钮状态
    const btnEdit = document.getElementById('btn-mode-edit');
    const btnSplit = document.getElementById('btn-mode-split');
    const btnPreview = document.getElementById('btn-mode-preview');

    // 重置所有按钮样式
    [btnEdit, btnSplit, btnPreview].forEach(btn => {
      if (btn) {
        btn.classList.remove('bg-white', 'shadow', 'text-slate-700');
        btn.classList.add('text-slate-500', 'hover:text-slate-700');
      }
    });

    // 激活当前按钮
    const activeBtn = mode === 'edit' ? btnEdit : mode === 'split' ? btnSplit : btnPreview;
    if (activeBtn) {
      activeBtn.classList.remove('text-slate-500', 'hover:text-slate-700');
      activeBtn.classList.add('bg-white', 'shadow', 'text-slate-700');
    }

    // 更新视图
    switch (mode) {
      case 'edit':
        // 只显示编辑器
        this.editorContainer.classList.remove('hidden');
        this.editorContainer.style.flex = '1';
        this.editorContainer.style.borderRight = 'none';
        this.previewContainer.classList.add('hidden');
        break;

      case 'split':
        // 显示编辑器和预览
        this.editorContainer.classList.remove('hidden');
        this.editorContainer.style.flex = '1';
        this.editorContainer.style.borderRight = '1px solid rgb(229 231 235)';
        this.previewContainer.classList.remove('hidden');
        this.previewContainer.style.flex = '1';
        break;

      case 'preview':
        // 只显示预览
        this.editorContainer.classList.add('hidden');
        this.previewContainer.classList.remove('hidden');
        this.previewContainer.style.flex = '1';
        break;
    }

    // 更新预览
    this.updatePreview();
  }

  /**
   * 获取当前视图模式
   */
  getViewMode(): ViewMode {
    return this.viewMode;
  }

  /**
   * 调度预览更新（防抖）
   */
  private schedulePreviewUpdate(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this.updatePreview();
    }, 150);
  }

  /**
   * 更新预览
   */
  updatePreview(): void {
    const markdown = this.getContent();
    try {
      this.preview.innerHTML = parseMarkdown(markdown);
      // 高亮代码块
      if (typeof window.hljs !== 'undefined') {
        window.hljs.highlightAll();
      }
    } catch (e) {
      console.error('Markdown parse error:', e);
      this.preview.innerHTML = '<p class="text-red-500">Preview error: ' + (e as Error).message + '</p>';
    }
  }

  /**
   * 设置编辑器内容
   */
  setContent(content: string): void {
    this.editor.value = content;
    this.updatePreview();
    this.updateStats();
  }

  /**
   * 获取编辑器内容
   */
  getContent(): string {
    return this.editor.value;
  }

  /**
   * 更新统计信息
   */
  async updateStats(): Promise<void> {
    const content = this.getContent();
    const wordCountEl = document.getElementById('word-count');
    const charCountEl = document.getElementById('char-count');

    if (!wordCountEl || !charCountEl) return;

    try {
      if (tauriBridge.available) {
        const [words, chars] = await Promise.all([
          tauriBridge.countWords(content),
          tauriBridge.countChars(content)
        ]);
        wordCountEl.textContent = `Words: ${words}`;
        charCountEl.textContent = `Chars: ${chars}`;
      } else {
        throw new Error('Tauri not available');
      }
    } catch {
      const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
      wordCountEl.textContent = `Words: ${wordCount}`;
      charCountEl.textContent = `Chars: ${content.length}`;
    }
  }

  /**
   * 切换预览显示（兼容旧代码）
   */
  togglePreview(): void {
    // 循环切换模式
    const modes: ViewMode[] = ['edit', 'split', 'preview'];
    const currentIndex = modes.indexOf(this.viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    this.setViewMode(modes[nextIndex]);
  }

  /**
   * 插入格式
   */
  insertFormat(type: FormatType): void {
    const start = this.editor.selectionStart;
    const end = this.editor.selectionEnd;
    const text = this.editor.value;
    const selectedText = text.substring(start, end) || 'text';

    let replacement = '';
    let cursorOffset = 0;

    switch (type) {
      case 'bold':
        replacement = `**${selectedText}**`;
        cursorOffset = selectedText.length + 2;
        break;
      case 'italic':
        replacement = `*${selectedText}*`;
        cursorOffset = selectedText.length + 1;
        break;
      case 'ul':
        replacement = `- ${selectedText}`;
        cursorOffset = selectedText.length + 2;
        break;
      case 'ol':
        replacement = `1. ${selectedText}`;
        cursorOffset = selectedText.length + 3;
        break;
      case 'link':
        replacement = `[${selectedText}](url)`;
        cursorOffset = selectedText.length + 3;
        break;
      case 'image':
        replacement = `![${selectedText}](url)`;
        cursorOffset = selectedText.length + 4;
        break;
      case 'code':
        if (selectedText.includes('\n')) {
          replacement = '```\n' + selectedText + '\n```';
        } else {
          replacement = '`' + selectedText + '`';
        }
        break;
    }

    this.editor.value = text.substring(0, start) + replacement + text.substring(end);
    this.editor.focus();

    // 设置光标位置
    const newCursorPos = start + cursorOffset;
    this.editor.setSelectionRange(newCursorPos, newCursorPos);

    this.updatePreview();
    this.notifyContentChanged();
  }

  /**
   * 处理选择变化
   */
  private handleSelectionChange(): void {
    const activeElement = document.activeElement;
    if (activeElement !== this.editor) return;

    const start = this.editor.selectionStart;
    const end = this.editor.selectionEnd;

    if (start !== end) {
      const selectedText = this.editor.value.substring(start, end);
      this.showSelectionPreview(selectedText);
    } else {
      this.hideSelectionPreview();
    }
  }

  /**
   * 显示选中文本预览
   */
  private showSelectionPreview(text: string): void {
    const preview = document.getElementById('selection-preview');
    const content = document.getElementById('selected-text-content');

    if (!preview || !content) return;

    const truncated = text.length > 100 ? text.substring(0, 100) + '...' : text;
    content.textContent = `"${truncated}"`;
    preview.classList.remove('hidden');

    this.selectedText = text;
  }

  /**
   * 隐藏选中文本预览
   */
  private hideSelectionPreview(): void {
    const preview = document.getElementById('selection-preview');
    if (preview) {
      preview.classList.add('hidden');
    }
    this.selectedText = null;
  }

  /**
   * 通知内容变化
   */
  private notifyContentChanged(): void {
    const status = document.getElementById('save-status');
    if (status) {
      status.innerHTML = '<span class="material-symbols-outlined text-xs text-yellow-500">edit</span>Unsaved changes';
    }
    this.contentChangedCallback?.();
  }

  /**
   * 保存文件
   */
  async saveFile(): Promise<void> {
    if (this.saveFileCallback) {
      await this.saveFileCallback();
    }
  }

  /**
   * 获取选中的文本
   */
  getSelectedText(): string {
    if (this.selectedText) {
      return this.selectedText;
    }
    return this.editor.value.substring(
      this.editor.selectionStart,
      this.editor.selectionEnd
    );
  }

  /**
   * 替换选中文本
   */
  replaceSelectedText(replacement: string): void {
    const start = this.editor.selectionStart;
    const end = this.editor.selectionEnd;
    const text = this.editor.value;

    this.editor.value = text.substring(0, start) + replacement + text.substring(end);
    this.editor.focus();
    this.editor.setSelectionRange(start + replacement.length, start + replacement.length);

    this.updatePreview();
    this.notifyContentChanged();
  }
}
