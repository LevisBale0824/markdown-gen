// Simple App Module for Settings and Language

class App {
    constructor() {
        this.config = {
            ai: {
                provider: 'glm',
                api_key: '',
                api_endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                model: 'glm-4-flash',
                max_tokens: 4096
            },
            theme: 'light',
            language: 'zh',
            // 自定义主题配置
            customTheme: {
                enabled: false,
                name: '自定义',
                backgroundColor: '#ffffff',
                textColor: '#1f2937',
                accentColor: '#2563eb',
                borderColor: '#e5e7eb',
                codeBackgroundColor: '#f3f4f6',
                secondaryBackgroundColor: '#f9fafb',
                mutedTextColor: '#6b7280'
            }
        };
        this.currentFile = null;
        this.init();
    }

    init() {
        this.loadConfig();
        this.setupLanguage();
        this.applyTheme();
        this.setupResizers();
    }

    loadConfig() {
        const saved = localStorage.getItem('markdown-studio-config');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.config = { ...this.config, ...parsed };
            } catch (e) {
                console.error('Failed to load config:', e);
            }
        }
    }

    saveConfig() {
        localStorage.setItem('markdown-studio-config', JSON.stringify(this.config));
    }

    setupLanguage() {
        // 设置语言
        if (window.setLanguage) {
            window.setLanguage(this.config.language);
        }
    }

    applyTheme() {
        const html = document.documentElement;
        const body = document.body;

        // 移除旧的主题类
        html.classList.remove('light', 'dark');

        if (this.config.theme === 'custom' && this.config.customTheme.enabled) {
            this.applyCustomTheme();
        } else if (this.config.theme === 'dark') {
            html.classList.add('dark');
            this.applyDarkTheme();
        } else {
            html.classList.add('light');
            this.applyLightTheme();
        }
    }

    applyLightTheme() {
        const html = document.documentElement;
        const body = document.body;

        // 移除深色类，添加浅色类
        html.classList.remove('dark');
        html.classList.add('light');

        // 禁用 highlight.js 主题（使用自定义样式）
        const hljsTheme = document.getElementById('highlightjs-theme');
        if (hljsTheme) hljsTheme.disabled = true;

        // 设置浅色背景
        body.style.backgroundColor = '#ffffff';
        body.style.color = '#1f2937';

        // 重置所有内联样式
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundColor = '';
            header.style.borderColor = '';
        }

        const aside = document.querySelectorAll('aside');
        aside.forEach(el => {
            el.style.backgroundColor = '';
            el.style.borderColor = '';
        });

        const toolbar = document.querySelector('.flex.items-center.justify-between.px-4.h-12');
        if (toolbar) {
            toolbar.style.backgroundColor = '';
            toolbar.style.borderColor = '';
        }

        const main = document.querySelector('main');
        if (main) {
            main.style.backgroundColor = '';
            main.style.borderColor = '';
        }

        const editorContainer = document.getElementById('editor-container');
        if (editorContainer) {
            editorContainer.style.backgroundColor = '';
        }

        const previewContainer = document.getElementById('preview-container');
        if (previewContainer) {
            previewContainer.style.backgroundColor = '';
            previewContainer.style.borderColor = '';
        }

        const statusBar = document.querySelector('.h-6.bg-gray-100');
        if (statusBar) {
            statusBar.style.backgroundColor = '';
            statusBar.style.borderColor = '';
            statusBar.style.color = '';
        }

        const aiPanel = document.querySelector('.w-72.border-l');
        if (aiPanel) {
            aiPanel.style.backgroundColor = '';
            aiPanel.style.borderColor = '';
        }

        const fileTree = document.getElementById('file-tree');
        if (fileTree) {
            fileTree.style.backgroundColor = '';
        }

        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.style.backgroundColor = '';
            input.style.color = '';
            input.style.borderColor = '';
        });

        // 移除深色样式
        const darkStyle = document.getElementById('dark-theme-style');
        if (darkStyle) {
            darkStyle.textContent = '';
        }

        // 更新CSS变量
        document.documentElement.style.setProperty('--bg-primary', '#ffffff');
        document.documentElement.style.setProperty('--bg-secondary', '#f9fafb');
        document.documentElement.style.setProperty('--text-primary', '#1f2937');
        document.documentElement.style.setProperty('--text-secondary', '#6b7280');
        document.documentElement.style.setProperty('--border-color', '#e5e7eb');
        document.documentElement.style.setProperty('--accent-color', '#2563eb');
        document.documentElement.style.setProperty('--code-bg', '#f3f4f6');
    }

    applyDarkTheme() {
        const body = document.body;
        const html = document.documentElement;

        // 移除浅色类
        html.classList.remove('light');
        html.classList.add('dark');

        // 禁用 highlight.js 主题（使用自定义样式）
        const hljsTheme = document.getElementById('highlightjs-theme');
        if (hljsTheme) hljsTheme.disabled = true;

        // 设置深色背景
        body.style.backgroundColor = '#111827';
        body.style.color = '#e5e7eb';

        // 更新CSS变量
        document.documentElement.style.setProperty('--bg-primary', '#111827');
        document.documentElement.style.setProperty('--bg-secondary', '#1f2937');
        document.documentElement.style.setProperty('--text-primary', '#e5e7eb');
        document.documentElement.style.setProperty('--text-secondary', '#9ca3af');
        document.documentElement.style.setProperty('--border-color', '#374151');
        document.documentElement.style.setProperty('--accent-color', '#3b82f6');
        document.documentElement.style.setProperty('--code-bg', '#1f2937');

        // 顶部导航和头部
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundColor = '#111827';
            header.style.borderColor = '#374151';
        }

        // 侧边栏
        const aside = document.querySelectorAll('aside');
        aside.forEach(el => {
            el.style.backgroundColor = '#111827';
            el.style.borderColor = '#4b5563';
        });

        // 工具栏（编辑器和其他区域的标题栏）
        const toolbars = document.querySelectorAll('.flex.items-center.justify-between.px-4.h-12, .flex.items-center.gap-2.px-4.h-12');
        toolbars.forEach(toolbar => {
            toolbar.style.backgroundColor = '#1f2937';
            toolbar.style.borderColor = '#4b5563';
        });

        const toolbar2 = document.querySelector('.flex.items-center.justify-between.px-4.h-12');
        if (toolbar2) {
            toolbar2.style.backgroundColor = '#1f2937';
            toolbar2.style.borderColor = '#4b5563';
        }

        // 主编辑区域
        const main = document.querySelector('main');
        if (main) {
            main.style.backgroundColor = '#111827';
            main.style.borderColor = '#4b5563';
        }

        // 编辑器容器
        const editorContainer = document.getElementById('editor-container');
        if (editorContainer) {
            editorContainer.style.backgroundColor = '#111827';
        }

        // 预览容器
        const previewContainer = document.getElementById('preview-container');
        if (previewContainer) {
            previewContainer.style.backgroundColor = '#111827';
            previewContainer.style.borderColor = '#4b5563';
        }

        // 状态栏
        const statusBar = document.querySelector('.h-6.bg-gray-100');
        if (statusBar) {
            statusBar.style.backgroundColor = '#0f172a';
            statusBar.style.borderColor = '#374151';
            statusBar.style.color = '#9ca3af';
        }

        // AI 面板
        const aiPanel = document.querySelector('.w-72.border-l');
        if (aiPanel) {
            aiPanel.style.backgroundColor = '#1f2937';
            aiPanel.style.borderColor = '#4b5563';
        }

        // 输入框和文本区域
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.style.backgroundColor = '#1f2937';
            input.style.color = '#e5e7eb';
            input.style.borderColor = '#4b5563';
        });

        // 文件树容器
        const fileTree = document.getElementById('file-tree');
        if (fileTree) {
            fileTree.style.backgroundColor = '#111827';
        }

        // 添加深色样式到head
        let darkStyle = document.getElementById('dark-theme-style');
        if (!darkStyle) {
            darkStyle = document.createElement('style');
            darkStyle.id = 'dark-theme-style';
            document.head.appendChild(darkStyle);
        }

        darkStyle.textContent = `
            .dark body {
                background-color: #111827 !important;
                color: #e5e7eb !important;
            }
            .dark header {
                background-color: #111827 !important;
                border-bottom-color: #4b5563 !important;
            }
            .dark aside {
                background-color: #111827 !important;
                border-color: #4b5563 !important;
            }
            .dark main {
                background-color: #111827 !important;
            }
            .dark .border-r {
                border-right-color: #4b5563 !important;
            }
            .dark .border-l {
                border-left-color: #4b5563 !important;
            }
            .dark .border-b {
                border-bottom-color: #4b5563 !important;
            }
            .dark .border-t {
                border-top-color: #4b5563 !important;
            }
            .dark input,
            .dark textarea,
            .dark select {
                background-color: #1f2937 !important;
                color: #e5e7eb !important;
                border-color: #4b5563 !important;
            }
            .dark .bg-gray-50,
            .dark .bg-gray-100 {
                background-color: #1f2937 !important;
            }
            .dark .bg-white {
                background-color: #1f2937 !important;
            }
            .dark .text-slate-600,
            .dark .text-slate-700 {
                color: #d1d5db !important;
            }
            .dark .text-slate-500 {
                color: #9ca3af !important;
            }
            .dark .text-slate-900 {
                color: #e5e7eb !important;
            }
            .dark .hover\\:bg-gray-200:hover {
                background-color: #374151 !important;
            }
            .dark .border-gray-200 {
                border-color: #4b5563 !important;
            }
            /* 标题栏统一样式 */
            .dark .h-12 {
                background-color: #1f2937 !important;
            }
            /* 分割条深色样式 */
            .dark #left-resizer,
            .dark #right-resizer {
                background-color: #4b5563 !important;
            }
            .dark #left-resizer:hover,
            .dark #right-resizer:hover {
                background-color: #3b82f6 !important;
            }
        `;
    }

    applyCustomTheme() {
        const theme = this.config.customTheme;
        const body = document.body;
        const html = document.documentElement;

        // 应用到 body
        body.style.backgroundColor = theme.backgroundColor;
        body.style.color = theme.textColor;

        // 更新CSS变量
        document.documentElement.style.setProperty('--bg-primary', theme.backgroundColor);
        document.documentElement.style.setProperty('--bg-secondary', theme.secondaryBackgroundColor);
        document.documentElement.style.setProperty('--text-primary', theme.textColor);
        document.documentElement.style.setProperty('--text-secondary', theme.mutedTextColor);
        document.documentElement.style.setProperty('--border-color', theme.borderColor);
        document.documentElement.style.setProperty('--accent-color', theme.accentColor);
        document.documentElement.style.setProperty('--code-bg', theme.codeBackgroundColor);

        // 应用到各个元素
        // 顶部导航和头部
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundColor = theme.backgroundColor;
            header.style.borderColor = theme.borderColor;
        }

        // 侧边栏
        const aside = document.querySelectorAll('aside');
        aside.forEach(el => {
            el.style.backgroundColor = theme.backgroundColor;
            el.style.borderColor = theme.borderColor;
        });

        // 工具栏
        const toolbar = document.querySelector('.flex.items-center.justify-between.px-4.h-12');
        if (toolbar) {
            toolbar.style.backgroundColor = theme.secondaryBackgroundColor;
            toolbar.style.borderColor = theme.borderColor;
        }

        // 编辑器区域
        const editorContainer = document.getElementById('editor-container');
        if (editorContainer) {
            editorContainer.style.backgroundColor = theme.backgroundColor;
        }

        // 预览区域
        const previewContainer = document.getElementById('preview-container');
        if (previewContainer) {
            previewContainer.style.backgroundColor = theme.backgroundColor;
            previewContainer.style.borderColor = theme.borderColor;
        }

        // 状态栏
        const statusBar = document.querySelector('.h-6.bg-gray-100');
        if (statusBar) {
            statusBar.style.backgroundColor = theme.secondaryBackgroundColor;
            statusBar.style.borderColor = theme.borderColor;
        }

        // AI 面板
        const aiPanel = document.querySelector('.w-72.border-l');
        if (aiPanel) {
            aiPanel.style.backgroundColor = theme.secondaryBackgroundColor;
            aiPanel.style.borderColor = theme.borderColor;
        }

        // 按钮 - 更新强调色
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            if (!btn.classList.contains('bg-primary')) {
                btn.style.color = theme.textColor;
            }
        });

        // 预览按钮选中状态
        const previewBtn = document.getElementById('btn-preview');
        if (previewBtn && previewBtn.classList.contains('bg-primary')) {
            previewBtn.style.backgroundColor = theme.accentColor;
        }

        // 代码块
        const style = document.getElementById('custom-theme-style') || document.createElement('style');
        style.id = 'custom-theme-style';
        style.textContent = `
            #markdown-preview pre {
                background: ${theme.codeBackgroundColor} !important;
                border-color: ${theme.borderColor} !important;
            }
            #markdown-preview code {
                color: ${theme.textColor} !important;
            }
            .chat-message.assistant {
                background: ${theme.backgroundColor} !important;
                border-color: ${theme.borderColor} !important;
                color: ${theme.textColor} !important;
            }
            input[type="text"], input[type="password"], textarea {
                background: ${theme.secondaryBackgroundColor} !important;
                color: ${theme.textColor} !important;
                border-color: ${theme.borderColor} !important;
            }
        `;
        if (!document.getElementById('custom-theme-style')) {
            document.head.appendChild(style);
        }
    }

    openSettings() {
        const modal = document.getElementById('settings-modal');

        // Populate current config
        document.getElementById('ai-provider').value = this.config.ai.provider;
        document.getElementById('ai-api-key').value = this.config.ai.api_key;
        document.getElementById('ai-endpoint').value = this.config.ai.api_endpoint;
        document.getElementById('ai-model').value = this.config.ai.model;
        document.getElementById('app-theme').value = this.config.theme;
        document.getElementById('app-language').value = this.config.language;

        modal.classList.remove('hidden');
    }

    closeSettings() {
        document.getElementById('settings-modal').classList.add('hidden');
    }

    saveSettings() {
        this.config.ai.provider = document.getElementById('ai-provider').value;
        this.config.ai.api_key = document.getElementById('ai-api-key').value;
        this.config.ai.api_endpoint = document.getElementById('ai-endpoint').value;
        this.config.ai.model = document.getElementById('ai-model').value;
        const newTheme = document.getElementById('app-theme').value;
        const newLanguage = document.getElementById('app-language').value;

        // 切换主题
        if (newTheme !== this.config.theme) {
            this.config.theme = newTheme;
            this.applyTheme();
        }

        // 切换语言
        if (newLanguage !== this.config.language) {
            this.config.language = newLanguage;
            if (window.setLanguage) {
                window.setLanguage(newLanguage);
            }
        }

        // 保存自定义主题配置
        if (newTheme === 'custom') {
            this.config.customTheme.enabled = true;
            this.config.customTheme.backgroundColor = document.getElementById('theme-bg-color')?.value || '#ffffff';
            this.config.customTheme.textColor = document.getElementById('theme-text-color')?.value || '#1f2937';
            this.config.customTheme.accentColor = document.getElementById('theme-accent-color')?.value || '#2563eb';
            this.config.customTheme.borderColor = document.getElementById('theme-border-color')?.value || '#e5e7eb';
            this.config.customTheme.codeBackgroundColor = document.getElementById('theme-code-bg-color')?.value || '#f3f4f6';
            this.config.customTheme.secondaryBackgroundColor = document.getElementById('theme-secondary-bg-color')?.value || '#f9fafb';
            this.config.customTheme.mutedTextColor = document.getElementById('theme-muted-text-color')?.value || '#6b7280';
            this.applyCustomTheme();
        } else {
            this.config.customTheme.enabled = false;
        }

        this.saveConfig();
        this.closeSettings();
        console.log('Settings saved successfully');
    }

    async openFolder() {
        const path = prompt(window.t('openFilePrompt') || '输入文件夹路径以打开:', 'C:\\Users\\Min\\Documents');

        if (path) {
            try {
                const result = await window.tauriInvoke('open_folder', { path });
                // 如果 fileExplorer 存在，更新文件树
                if (window.fileExplorer && result.files) {
                    window.fileExplorer.renderFiles(result.files, path);
                }
            } catch (error) {
                console.error('Failed to open folder:', error);
                alert('打开文件夹失败: ' + error);
            }
        }
    }

    async openFile() {
        const path = prompt(window.t('openFilePrompt') || 'Enter file path to open:', 'C:\\Users\\Min\\Documents\\example.md');

        if (path) {
            try {
                const content = await window.tauriInvoke('open_file', { path });
                if (window.editor) {
                    window.editor.setContent(content);
                    this.currentFile = path;
                    this.updateFileName(path);
                }
            } catch (error) {
                console.error('Failed to open file:', error);
                alert('Failed to open file: ' + error);
            }
        }
    }

    async saveCurrentFile() {
        console.log('saveCurrentFile called');
        if (!window.editor) {
            console.log('No editor found');
            return;
        }

        const content = window.editor.getContent();
        console.log('Content length:', content.length);

        if (this.currentFile) {
            console.log('Saving to existing file:', this.currentFile);
            try {
                if (window.tauriInvoke) {
                    await window.tauriInvoke('save_file', { path: this.currentFile, content });
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
            // Use save dialog via backend command
            try {
                console.log('Opening save dialog...');
                const filePath = await window.tauriInvoke('save_file_dialog', { defaultName: 'untitled.md' });

                console.log('Selected path:', filePath);

                if (filePath) {
                    await window.tauriInvoke('save_file', { path: filePath, content });
                    this.currentFile = filePath;
                    this.updateFileName(filePath);
                    this.updateSaveStatus(true);
                }
            } catch (error) {
                console.error('Failed to save file:', error);
                if (!window.tauriInvoke) {
                    // Browser fallback
                    localStorage.setItem('markdown-content', content);
                    this.updateSaveStatus(true);
                } else {
                    alert('保存失败: ' + error);
                }
            }
        }
    }

    updateFileName(path) {
        const fileName = path.split(/[/\\]/).pop();
        const statusEl = document.getElementById('current-file');
        if (statusEl) statusEl.textContent = fileName || (window.t ? window.t('untitledWithExt') : '未命名.md');
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

    createNewFile() {
        this.currentFile = null;
        if (window.editor) {
            window.editor.setContent('');
        }
        const statusEl = document.getElementById('current-file');
        if (statusEl) statusEl.textContent = window.t ? window.t('untitledWithExt') : '未命名.md';
    }

    toggleCustomTheme(themeValue) {
        const customConfig = document.getElementById('custom-theme-config');

        if (themeValue === 'custom') {
            customConfig.classList.remove('hidden');
            // 加载保存的自定义主题配置
            if (this.config.customTheme.enabled) {
                document.getElementById('theme-bg-color').value = this.config.customTheme.backgroundColor;
                document.getElementById('theme-text-color').value = this.config.customTheme.textColor;
                document.getElementById('theme-accent-color').value = this.config.customTheme.accentColor;
                document.getElementById('theme-border-color').value = this.config.customTheme.borderColor;
                document.getElementById('theme-code-bg-color').value = this.config.customTheme.codeBackgroundColor;
                document.getElementById('theme-secondary-bg-color').value = this.config.customTheme.secondaryBackgroundColor;
                document.getElementById('theme-muted-text-color').value = this.config.customTheme.mutedTextColor;
            }
            // 立即应用自定义主题（预览效果）
            this.config.theme = 'custom';
            this.applyTheme();
        } else {
            customConfig.classList.add('hidden');
            // 切换到预设主题
            this.config.theme = themeValue;
            this.applyTheme();
        }
    }

    setupResizers() {
        // 左侧分割条
        const leftResizer = document.getElementById('left-resizer');
        const leftSidebar = document.getElementById('left-sidebar');

        // 右侧分割条
        const rightResizer = document.getElementById('right-resizer');
        const rightSidebar = document.getElementById('right-sidebar');

        // 加载保存的宽度
        const savedLeftWidth = localStorage.getItem('left-sidebar-width');
        const savedRightWidth = localStorage.getItem('right-sidebar-width');

        if (savedLeftWidth) {
            leftSidebar.style.width = savedLeftWidth;
        }
        if (savedRightWidth) {
            rightSidebar.style.width = savedRightWidth;
        }

        // 左侧拖动
        leftResizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            leftResizer.classList.add('resizing');
            const startX = e.clientX;
            const startWidth = leftSidebar.offsetWidth;

            const onMouseMove = (e) => {
                const diff = e.clientX - startX;
                const newWidth = startWidth + diff;
                const minWidth = 150;
                const maxWidth = 500;

                if (newWidth >= minWidth && newWidth <= maxWidth) {
                    leftSidebar.style.width = newWidth + 'px';
                }
            };

            const onMouseUp = () => {
                leftResizer.classList.remove('resizing');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                localStorage.setItem('left-sidebar-width', leftSidebar.style.width);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // 右侧拖动
        rightResizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            rightResizer.classList.add('resizing');
            const startX = e.clientX;
            const startWidth = rightSidebar.offsetWidth;

            const onMouseMove = (e) => {
                const diff = startX - e.clientX;
                const newWidth = startWidth + diff;
                const minWidth = 200;
                const maxWidth = 600;

                if (newWidth >= minWidth && newWidth <= maxWidth) {
                    rightSidebar.style.width = newWidth + 'px';
                }
            };

            const onMouseUp = () => {
                rightResizer.classList.remove('resizing');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                localStorage.setItem('right-sidebar-width', rightSidebar.style.width);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }
}

// FileExplorer class for file browser functionality
class FileExplorer {
    constructor() {
        this.fileTree = document.getElementById('file-tree');
        this.currentPath = null;
        this.init();
    }

    async init() {
        this.currentPath = '.';
        await this.loadDirectory(this.currentPath);
    }

    async loadDirectory(path) {
        try {
            if (window.tauriInvoke) {
                const files = await window.tauriInvoke('read_directory', { path });
                this.renderFileTree(files);
                this.currentPath = path;
            } else {
                this.renderEmpty();
            }
        } catch (error) {
            console.error('Failed to load directory:', error);
            this.renderError('无法加载目录');
        }
    }

    renderEmpty() {
        this.fileTree.innerHTML = '<div class="px-4 py-2 text-sm text-slate-400">请打开一个文件夹</div>';
    }

    renderFileTree(files) {
        this.fileTree.innerHTML = '';

        if (files.length === 0) {
            this.fileTree.innerHTML = '<div class="px-4 py-2 text-sm text-slate-400">空目录</div>';
            return;
        }

        files.forEach(file => {
            const item = document.createElement('div');
            item.className = 'file-item flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg cursor-pointer hover:bg-slate-100';

            if (file.is_dir) {
                item.classList.add('font-medium', 'text-slate-700');
                item.innerHTML = `
                    <span class="material-symbols-outlined text-slate-400 text-lg">folder</span>
                    <span>${file.name}</span>
                `;
                item.addEventListener('click', () => this.loadDirectory(file.path));
            } else {
                item.classList.add('text-slate-600');
                item.innerHTML = `
                    <span class="material-symbols-outlined text-slate-400 text-lg">description</span>
                    <span>${file.name}</span>
                `;
                item.addEventListener('click', () => this.openFile(file.path));
            }

            this.fileTree.appendChild(item);
        });
    }

    async openFile(path) {
        try {
            if (window.tauriInvoke) {
                const content = await window.tauriInvoke('open_file', { path });
                if (window.editor) {
                    window.editor.setContent(content);
                }
                if (window.app) {
                    window.app.currentFile = path;
                    window.app.updateFileName(path);
                }
                document.querySelectorAll('.file-item').forEach(el => el.classList.remove('active'));
                event.target.closest('.file-item')?.classList.add('active');
            }
        } catch (error) {
            console.error('Failed to open file:', error);
            alert('打开文件失败: ' + error);
        }
    }

    async createNewFile() {
        const fileName = prompt('输入文件名:', 'untitled.md');
        if (!fileName) return;

        const savePath = this.currentPath + '\\' + fileName;

        try {
            if (window.tauriInvoke) {
                await window.tauriInvoke('create_file', { path: savePath });
                await this.openFile(savePath);
                await this.loadDirectory(this.currentPath);
            } else {
                alert('请在 Tauri 应用中使用此功能');
            }
        } catch (error) {
            console.error('Failed to create file:', error);
            alert('创建文件失败: ' + error);
        }
    }

    renderError(message) {
        this.fileTree.innerHTML = `<div class="px-4 py-2 text-sm text-red-400">${message}</div>`;
    }
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing App...');
    window.app = new App();
    window.fileExplorer = new FileExplorer();
    console.log('App initialized!');
});
