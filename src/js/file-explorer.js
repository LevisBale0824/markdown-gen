import { invoke } from '@tauri-apps/api/core';

class FileExplorer {
    constructor() {
        this.fileTree = document.getElementById('file-tree');
        this.currentPath = null;
        this.init();
    }

    async init() {
        // Load last path from config or use home directory
        this.currentPath = app.config?.last_path || await this.getDefaultPath();
        await this.loadDirectory(this.currentPath);
    }

    async getDefaultPath() {
        // Try to get a reasonable default path
        // In production, you might want to use Tauri's path API
        return '.';
    }

    async loadDirectory(path) {
        try {
            const files = await invoke('read_directory', { path });
            this.renderFileTree(files);
            this.currentPath = path;
        } catch (error) {
            console.error('Failed to load directory:', error);
            this.renderError('Failed to load directory');
        }
    }

    renderFileTree(files) {
        this.fileTree.innerHTML = '';

        if (files.length === 0) {
            this.fileTree.innerHTML = '<div class="px-4 py-2 text-sm text-slate-400">Empty directory</div>';
            return;
        }

        files.forEach(file => {
            const item = document.createElement('div');
            item.className = 'file-item flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg';

            if (file.is_dir) {
                item.classList.add('font-medium', 'text-slate-700', 'dark:text-slate-300');
                item.innerHTML = `
                    <span class="material-symbols-outlined text-slate-400">folder</span>
                    <span>${file.name}</span>
                `;
                item.addEventListener('click', () => this.loadDirectory(file.path));
            } else {
                item.classList.add('text-slate-600', 'dark:text-slate-400');
                item.innerHTML = `
                    <span class="material-symbols-outlined text-sm text-slate-400">description</span>
                    <span>${file.name}</span>
                `;
                item.addEventListener('click', () => this.openFile(file.path));
                item.addEventListener('dblclick', () => this.openFile(file.path));
            }

            this.fileTree.appendChild(item);
        });
    }

    async openFile(path) {
        try {
            const content = await invoke('open_file', { path });
            editor.setContent(content);
            app.currentFile = path;
            app.updateFileName(path);

            // Highlight active file
            document.querySelectorAll('.file-item').forEach(el => el.classList.remove('active'));
        } catch (error) {
            console.error('Failed to open file:', error);
            alert('Failed to open file: ' + error);
        }
    }

    async createNewFile() {
        try {
            const fileName = prompt('Enter file name:', 'untitled.md');
            if (!fileName) return;

            const savePath = this.currentPath + '\\' + fileName;

            // Create empty file
            await invoke('create_file', { path: savePath });
            // Open the new file
            await this.openFile(savePath);
            // Refresh directory
            await this.loadDirectory(this.currentPath);
        } catch (error) {
            console.error('Failed to create file:', error);
            alert('Failed to create file: ' + error);
        }
    }

    renderError(message) {
        this.fileTree.innerHTML = `
            <div class="px-4 py-2 text-sm text-red-400">
                ${message}
            </div>
        `;
    }
}

// Export the FileExplorer class
export { FileExplorer };
