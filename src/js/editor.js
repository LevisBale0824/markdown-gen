// Use Tauri global API
const invoke = window.__TAURI__?.core?.invoke || ((cmd, args) => {
    console.warn('Tauri API not available, using mock');
    return Promise.reject('Tauri API not available');
});

// Simple markdown parser fallback
function simpleMarkdownParse(md) {
    let html = md;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold and Italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/gim, '<pre><code>$2</code></pre>');
    html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

    // Links and images
    html = html.replace(/!\[([^\]]+)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1">');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

    // Lists
    html = html.replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');
    html = html.replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ol>)/g, '$1');
    html = html.replace(/(<\/ol>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    return html;
}

// Configure marked if available, otherwise use fallback
const parseMarkdown = typeof marked !== 'undefined'
    ? (md) => marked.parse(md)
    : simpleMarkdownParse;

// Editor class
class Editor {
    constructor() {
        this.editor = document.getElementById('markdown-editor');
        this.preview = document.getElementById('markdown-preview');
        this.previewContainer = document.getElementById('preview-container');
        this.editorContainer = document.getElementById('editor-container');
        this.showPreview = false;
        this.debounceTimer = null;

        this.init();
    }

    init() {
        // Listen for input changes
        this.editor.addEventListener('input', () => {
            this.updatePreview();
            this.updateStats();
            this.onContentChanged();
        });

        // Track selection changes
        document.addEventListener('selectionchange', () => {
            this.handleSelectionChange();
        });

        // Initialize with placeholder text
        this.setContent(`# Welcome to Markdown Studio Pro

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
`);
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

        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            const markdown = this.getContent();
            try {
                this.preview.innerHTML = parseMarkdown(markdown);
            } catch (e) {
                console.error('Markdown parse error:', e);
                this.preview.innerHTML = '<p class="text-red-500">Preview error: ' + e.message + '</p>';
            }
        }, 100);
    }

    updateStats() {
        const content = this.getContent();

        invoke('count_words', { content })
            .then(count => {
                document.getElementById('word-count').textContent = `Words: ${count}`;
            })
            .catch(() => {
                const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
                document.getElementById('word-count').textContent = `Words: ${wordCount}`;
            });

        invoke('count_chars', { content })
            .then(count => {
                document.getElementById('char-count').textContent = `Chars: ${count}`;
            })
            .catch(() => {
                document.getElementById('char-count').textContent = `Chars: ${content.length}`;
            });
    }

    togglePreview() {
        this.showPreview = !this.showPreview;

        console.log('Toggle preview:', this.showPreview);
        console.log('Preview container:', this.previewContainer);
        console.log('Editor container:', this.editorContainer);

        if (this.showPreview) {
            this.previewContainer.classList.remove('hidden');
            // Make editor and preview side by side
            this.editorContainer.style.flex = '1';
            this.previewContainer.style.flex = '1';
            this.updatePreview();
        } else {
            this.previewContainer.classList.add('hidden');
            // Editor takes full width
            this.editorContainer.style.flex = '1';
        }
    }

    insertFormat(type) {
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

        // Set cursor position
        const newCursorPos = start + cursorOffset;
        this.editor.setSelectionRange(newCursorPos, newCursorPos);

        this.updatePreview();
        this.onContentChanged();
    }

    handleSelectionChange() {
        // Only process if selection is within editor
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

    showSelectionPreview(text) {
        const preview = document.getElementById('selection-preview');
        const content = document.getElementById('selected-text-content');

        // Truncate if too long
        const truncated = text.length > 100 ? text.substring(0, 100) + '...' : text;
        content.textContent = `"${truncated}"`;
        preview.classList.remove('hidden');

        // Store selected text for AI actions
        this.selectedText = text;
    }

    hideSelectionPreview() {
        document.getElementById('selection-preview').classList.add('hidden');
        this.selectedText = null;
    }

    onContentChanged() {
        const status = document.getElementById('save-status');
        status.innerHTML = '<span class="material-symbols-outlined text-xs text-yellow-500">edit</span>Unsaved changes';
    }

    async saveFile() {
        await app.saveCurrentFile();
    }

    getSelectedText() {
        return this.selectedText || this.editor.value.substring(
            this.editor.selectionStart,
            this.editor.selectionEnd
        );
    }
}

// Export the Editor class
export { Editor };
