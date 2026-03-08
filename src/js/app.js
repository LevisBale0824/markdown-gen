// Use Tauri global API
const invoke = window.__TAURI__?.core?.invoke || ((cmd, args) => {
    console.warn('Tauri API not available, using mock');
    return Promise.reject('Tauri API not available');
});

// Initialize app
class App {
    constructor() {
        this.config = null;
        this.currentFile = null;
        this.init();
    }

    async init() {
        await this.loadConfig();
        this.applyTheme();
        this.setupKeyboardShortcuts();
    }

    async loadConfig() {
        try {
            this.config = await invoke('get_config');
        } catch (error) {
            console.error('Failed to load config:', error);
            this.config = {
                ai: {
                    provider: 'glm',
                    api_key: '',
                    api_endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                    model: 'glm-4-flash',
                    max_tokens: 4096
                },
                theme: 'dark',
                last_path: ''
            };
        }
    }

    applyTheme() {
        const html = document.documentElement;
        if (this.config.theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }

    async openSettings() {
        const modal = document.getElementById('settings-modal');

        // Populate current config
        document.getElementById('ai-provider').value = this.config.ai.provider;
        document.getElementById('ai-api-key').value = this.config.ai.api_key;
        document.getElementById('ai-endpoint').value = this.config.ai.api_endpoint;
        document.getElementById('ai-model').value = this.config.ai.model;
        document.getElementById('app-theme').value = this.config.theme;

        modal.classList.remove('hidden');
    }

    closeSettings() {
        document.getElementById('settings-modal').classList.add('hidden');
    }

    async saveSettings() {
        const newConfig = {
            ai: {
                provider: document.getElementById('ai-provider').value,
                api_key: document.getElementById('ai-api-key').value,
                api_endpoint: document.getElementById('ai-endpoint').value,
                model: document.getElementById('ai-model').value,
                max_tokens: 4096
            },
            theme: document.getElementById('app-theme').value,
            last_path: this.config.last_path
        };

        try {
            await invoke('save_config', { config: newConfig });
            this.config = newConfig;
            this.applyTheme();
            this.closeSettings();
            console.log('Settings saved successfully');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings: ' + error);
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+S to save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                editor.saveFile();
            }
            // Ctrl+B for bold
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                editor.insertFormat('bold');
            }
            // Ctrl+I for italic
            if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                editor.insertFormat('italic');
            }
            // Ctrl+O to open file
            if (e.ctrlKey && e.key === 'o') {
                e.preventDefault();
                this.openFile();
            }
            // Ctrl+N for new file
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.createNewFile();
            }
            // Escape to close modal
            if (e.key === 'Escape') {
                this.closeSettings();
            }
        });
    }

    async openFile() {
        try {
            // Simple path prompt (dialog plugin not available)
            const path = prompt('Enter file path to open:', 'C:\\Users\\Min\\Documents\\example.md');

            if (path) {
                const content = await invoke('open_file', { path });
                editor.setContent(content);
                this.currentFile = path;
                this.updateFileName(path);
            }
        } catch (error) {
            console.error('Failed to open file:', error);
            alert('Failed to open file: ' + error);
        }
    }

    async saveCurrentFile() {
        const content = editor.getContent();

        if (this.currentFile) {
            try {
                await invoke('save_file', { path: this.currentFile, content });
                this.updateSaveStatus(true);
            } catch (error) {
                console.error('Failed to save file:', error);
                this.updateSaveStatus(false);
            }
        } else {
            // Save as new file - prompt for path
            try {
                const savePath = prompt('Enter file path to save:', 'C:\\Users\\Min\\Documents\\untitled.md');

                if (savePath) {
                    await invoke('save_file', { path: savePath, content });
                    this.currentFile = savePath;
                    this.updateFileName(savePath);
                    this.updateSaveStatus(true);
                }
            } catch (error) {
                console.error('Failed to save file:', error);
                this.updateSaveStatus(false);
            }
        }
    }

    updateFileName(path) {
        const fileName = path.split(/[/\\]/).pop();
        document.getElementById('current-file').textContent = fileName || 'Untitled.md';
    }

    updateSaveStatus(saved) {
        const status = document.getElementById('save-status');
        if (saved) {
            status.innerHTML = '<span class="material-symbols-outlined text-xs">done_all</span>All changes saved';
        } else {
            status.innerHTML = '<span class="material-symbols-outlined text-xs text-red-500">error</span>Save failed';
        }
    }

    createNewFile() {
        this.currentFile = null;
        editor.setContent('');
        document.getElementById('current-file').textContent = 'Untitled.md';
    }
}

// Export the App class
export { App };
