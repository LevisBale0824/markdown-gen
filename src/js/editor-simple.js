// Simple Markdown Parser (using marked.js if available, fallback to basic parser)
class SimpleMarkdown {
    parse(md) {
        // Use marked.js if available
        if (typeof marked !== 'undefined' && marked.parse) {
            return marked.parse(md);
        }

        // Fallback to basic parser
        let html = md;

        // Code blocks
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang}">${this.escapeHtml(code.trim())}</code></pre>`;
        });
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Headers
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold and Italic
        html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Links and images
        html = html.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        // Blockquotes
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

        // Lists - process line by line
        const lines = html.split('\n');
        let result = [];
        let inUl = false;
        let inOl = false;

        for (let line of lines) {
            const ulMatch = line.match(/^[\-\*] (.*)$/);
            const olMatch = line.match(/^\d+\. (.*)$/);

            if (ulMatch) {
                if (!inUl) {
                    result.push('<ul>');
                    inUl = true;
                }
                if (inOl) {
                    result.push('</ol>');
                    inOl = false;
                }
                result.push('<li>' + ulMatch[1] + '</li>');
            } else if (olMatch) {
                if (!inOl) {
                    result.push('<ol>');
                    inOl = true;
                }
                if (inUl) {
                    result.push('</ul>');
                    inUl = false;
                }
                result.push('<li>' + olMatch[1] + '</li>');
            } else {
                if (inUl) {
                    result.push('</ul>');
                    inUl = false;
                }
                if (inOl) {
                    result.push('</ol>');
                    inOl = false;
                }
                result.push(line);
            }
        }

        if (inUl) result.push('</ul>');
        if (inOl) result.push('</ol>');

        html = result.join('\n');

        // Line breaks and paragraphs
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';

        // Clean up
        html = html.replace(/<p>(<h[1-6]>)/g, '$1');
        html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<[uo]l>)/g, '$1');
        html = html.replace(/(<\/[uo]l>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre>)/g, '$1');
        html = html.replace(/(<\/pre>)<\/p>/g, '$1');
        html = html.replace(/<p>(<blockquote>)/g, '$1');
        html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
        html = html.replace(/<p><\/p>/g, '');

        return html;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Editor class
class Editor {
    constructor() {
        this.editor = document.getElementById('markdown-editor');
        this.preview = document.getElementById('markdown-preview');
        this.previewContainer = document.getElementById('preview-container');
        this.showPreview = false;
        // SimpleMarkdown 会自动使用 marked.js 如果可用
        this.markdown = new SimpleMarkdown();

        this.init();
    }

    init() {
        // Set initial content
        this.setContent(this.getDefaultContent());

        // Listen for input
        this.editor.addEventListener('input', () => {
            this.updatePreview();
            this.updateStats();
        });
    }

    getDefaultContent() {
        return `# Welcome to Markdown Studio Pro

This is a powerful Markdown editor with AI assistance.

## Features

- **Real-time preview** - See your rendered Markdown instantly
- **AI Assistant** - Get help with writing, editing, and more
- **File explorer** - Manage your documents easily
- **Dark/Light theme** - Easy on the eyes

## Getting Started

1. Start typing or open an existing file
2. Use the toolbar buttons for quick formatting
3. Toggle preview to see rendered output
4. Ask AI for help with your writing!

## Example Code

\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

> "The best way to predict the future is to create it." - Peter Drucker

Enjoy writing! ✨
`;
    }

    setContent(content) {
        this.editor.value = content;
        this.updatePreview();
        this.updateStats();
    }

    getContent() {
        return this.editor.value;
    }

    updatePreview() {
        if (!this.showPreview) return;
        const markdown = this.getContent();
        this.preview.innerHTML = this.markdown.parse(markdown);
    }

    updateStats() {
        const content = this.getContent();
        const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
        const chars = content.length;

        const wordCount = document.getElementById('word-count');
        const charCount = document.getElementById('char-count');

        // 使用 i18n 翻译
        const wordsLabel = window.t ? (window.currentLanguage() === 'zh' ? '字数' : 'Words') : 'Words';
        const charsLabel = window.t ? (window.currentLanguage() === 'zh' ? '字符' : 'Chars') : 'Chars';

        if (wordCount) wordCount.textContent = `${wordsLabel}: ${words}`;
        if (charCount) charCount.textContent = `${charsLabel}: ${chars}`;
    }

    togglePreview() {
        this.showPreview = !this.showPreview;

        const previewBtn = document.querySelector('[onclick="editor.togglePreview()"]');

        if (this.showPreview) {
            this.previewContainer.classList.remove('hidden');
            this.updatePreview();

            // 添加选中样式
            if (previewBtn) {
                previewBtn.classList.add('bg-primary', 'text-white', 'border-primary');
                previewBtn.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
            }
        } else {
            this.previewContainer.classList.add('hidden');

            // 移除选中样式
            if (previewBtn) {
                previewBtn.classList.remove('bg-primary', 'text-white', 'border-primary');
                previewBtn.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
            }
        }
    }

    insertFormat(type) {
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const text = this.editor.value;
        const selectedText = text.substring(start, end) || 'text';

        let replacement = '';

        switch (type) {
            case 'bold': replacement = `**${selectedText}**`; break;
            case 'italic': replacement = `*${selectedText}*`; break;
            case 'ul': replacement = `- ${selectedText}`; break;
            case 'ol': replacement = `1. ${selectedText}`; break;
            case 'link': replacement = `[${selectedText}](url)`; break;
            case 'image': replacement = `![${selectedText}](url)`; break;
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
        this.updatePreview();
    }

    async saveFile() {
        console.log('saveFile called');
        const content = this.getContent();

        if (window.app && window.app.currentFile) {
            console.log('Saving to existing file:', window.app.currentFile);
            try {
                if (window.tauriInvoke) {
                    await window.tauriInvoke('save_file', { path: window.app.currentFile, content });
                    this.updateSaveStatus(true);
                } else {
                    localStorage.setItem('markdown-content', content);
                    this.updateSaveStatus(true);
                }
            } catch (error) {
                console.error('Failed to save file:', error);
                this.updateSaveStatus(false);
                alert('保存失败: ' + error);
            }
        } else {
            // No file selected, use save dialog
            console.log('No current file, opening save dialog');
            if (window.app && window.app.saveCurrentFile) {
                await window.app.saveCurrentFile();
            } else if (!window.tauriInvoke) {
                localStorage.setItem('markdown-content', content);
                this.updateSaveStatus(true);
            }
        }
    }

    updateSaveStatus(saved) {
        const status = document.getElementById('save-status');
        if (!status) return;

        if (saved) {
            status.innerHTML = '<span class="material-symbols-outlined text-xs">done_all</span>' + (window.t ? window.t('allChangesSaved') : 'All changes saved');
        } else {
            status.innerHTML = '<span class="material-symbols-outlined text-xs text-red-500">error</span>' + (window.t ? window.t('saveFailed') : 'Save failed');
        }
    }
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Markdown Studio Pro...');

    // Create editor
    window.editor = new Editor();
    console.log('Editor initialized! Try: editor.togglePreview()');

    // Make Tauri invoke available globally - try multiple ways for Tauri v2
    if (window.__TAURI__) {
        console.log('__TAURI__ found:', window.__TAURI__);
        if (window.__TAURI__.core && window.__TAURI__.core.invoke) {
            window.tauriInvoke = window.__TAURI__.core.invoke;
            console.log('Using __TAURI__.core.invoke');
        } else if (window.__TAURI__.invoke) {
            window.tauriInvoke = window.__TAURI__.invoke;
            console.log('Using __TAURI__.invoke');
        }
    }

    if (!window.tauriInvoke) {
        console.warn('Tauri API not available - running in browser mode');
    }
});
