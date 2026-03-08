import { invoke } from '@tauri-apps/api/core';

class AIAssistant {
    constructor() {
        this.chatMessages = document.getElementById('chat-messages');
        this.aiInput = document.getElementById('ai-input');
        this.init();
    }

    init() {
        // Allow sending with Enter key (Shift+Enter for new line)
        this.aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    async sendMessage() {
        const message = this.aiInput.value.trim();
        if (!message) return;

        // Clear input
        this.aiInput.value = '';

        // Get current document context (first 1000 chars)
        const context = editor.getContent().substring(0, 1000);

        // Add user message to chat
        this.addMessage(message, 'user');

        // Show loading
        this.addLoadingIndicator();

        // Update AI status
        this.updateStatus('thinking');

        try {
            const response = await invoke('ai_chat', {
                message,
                context
            });

            // Remove loading indicator
            this.removeLoadingIndicator();

            // Add AI response
            this.addMessage(response, 'assistant');
            this.updateStatus('ready');
        } catch (error) {
            this.removeLoadingIndicator();
            this.addMessage(`Error: ${error}`, 'assistant');
            this.updateStatus('error');
        }
    }

    async quickAction(action) {
        // Get selected text or use current document
        let text = editor.getSelectedText();

        if (!text) {
            // If no selection, get the whole document
            text = editor.getContent();
        }

        if (!text || text.trim().length === 0) {
            alert('Please select some text or write something in the editor first.');
            return;
        }

        // Show action in chat
        const actionNames = {
            polish: 'Polishing text...',
            expand: 'Expanding text...',
            summarize: 'Summarizing text...',
            tone: 'Adjusting tone...'
        };

        this.addMessage(actionNames[action] || 'Processing...', 'assistant');
        this.addLoadingIndicator();
        this.updateStatus('thinking');

        try {
            const result = await invoke('ai_suggest', {
                text,
                action
            });

            this.removeLoadingIndicator();

            // Remove the loading message and show result
            this.chatMessages.lastChild.remove();
            this.addMessage(result, 'assistant');

            // Ask if user wants to apply the suggestion
            this.showApplySuggestion(result);

            this.updateStatus('ready');
        } catch (error) {
            this.removeLoadingIndicator();
            this.chatMessages.lastChild.remove();
            this.addMessage(`Error: ${error}`, 'assistant');
            this.updateStatus('error');
        }
    }

    addMessage(content, role) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;

        // Handle markdown in AI responses
        if (role === 'assistant') {
            // Simple markdown rendering for code blocks and basic formatting
            let formattedContent = content
                .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            messageDiv.innerHTML = formattedContent;
        } else {
            messageDiv.textContent = content;
        }

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'chat-message assistant loading-dots';
        loadingDiv.innerHTML = '<span></span><span></span><span></span>';
        loadingDiv.id = 'ai-loading';
        this.chatMessages.appendChild(loadingDiv);
        this.scrollToBottom();
    }

    removeLoadingIndicator() {
        const loading = document.getElementById('ai-loading');
        if (loading) loading.remove();
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showApplySuggestion(suggestion) {
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'flex gap-2 mt-2';

        const applyBtn = document.createElement('button');
        applyBtn.className = 'text-xs font-medium bg-primary text-white px-3 py-1 rounded hover:bg-primary/90';
        applyBtn.textContent = 'Replace Selected';
        applyBtn.onclick = () => this.applySuggestion(suggestion, 'replace');

        const insertBtn = document.createElement('button');
        insertBtn.className = 'text-xs font-medium border border-slate-300 px-3 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-700';
        insertBtn.textContent = 'Insert After';
        insertBtn.onclick = () => this.applySuggestion(suggestion, 'insert');

        buttonGroup.appendChild(applyBtn);
        buttonGroup.appendChild(insertBtn);

        this.chatMessages.appendChild(buttonGroup);
        this.scrollToBottom();
    }

    applySuggestion(suggestion, mode) {
        const editorElement = document.getElementById('markdown-editor');
        const start = editorElement.selectionStart;
        const end = editorElement.selectionEnd;
        const text = editorElement.value;

        if (mode === 'replace' && start !== end) {
            // Replace selected text
            editorElement.value = text.substring(0, start) + suggestion + text.substring(end);
        } else {
            // Insert at cursor or end
            const insertPos = start !== end ? end : text.length;
            editorElement.value = text.substring(0, insertPos) + '\n\n' + suggestion + text.substring(insertPos);
        }

        // Trigger update
        editor.setContent(editorElement.value);

        // Remove the button group
        const lastElement = this.chatMessages.lastElementChild;
        if (lastElement && lastElement.tagName === 'DIV') {
            lastElement.remove();
        }
    }

    updateStatus(status) {
        const statusEl = document.getElementById('ai-status');
        const statusTexts = {
            ready: '<span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>AI Ready',
            thinking: '<span class="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>AI Thinking...',
            error: '<span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>AI Error'
        };

        statusEl.innerHTML = statusTexts[status] || statusTexts.ready;
    }
}

// Export the AIAssistant class
export { AIAssistant };
