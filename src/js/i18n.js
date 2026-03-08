// 翻译文件
const translations = {
    zh: {
        // 顶部导航
        appTitle: 'Markdown 工作室',
        file: '文件',
        settings: '设置',
        searchFiles: '搜索文件...',
        openFilePrompt: '输入文件路径以打开:',
        saveFilePrompt: '输入文件路径以保存:',

        // 左侧文件浏览器
        explorer: '文件浏览器',
        newFile: '新建文件',
        openFolder: '打开文件夹',

        // 编辑器工具栏
        preview: '预览',
        save: '保存',
        publish: '发布',
        bold: '粗体',
        italic: '斜体',
        bulletList: '无序列表',
        numberedList: '有序列表',
        link: '链接',
        image: '图片',
        code: '代码',

        // 状态栏
        allChangesSaved: '所有更改已保存',
        unsavedChanges: '未保存的更改',
        saveFailed: '保存失败',
        utf8: 'UTF-8',
        untitled: '未命名',
        untitledWithExt: '未命名.md',
        lines: '行',
        words: '字数',
        chars: '字符',
        wordCount: '字数: 0',
        charCount: '字符: 0',
        aiReady: 'AI 就绪',
        aiThinking: 'AI 思考中...',
        aiError: 'AI 错误',
        connectedToAi: '已连接到 AI 引擎',

        // AI 助手
        aiAssistant: 'AI 助手',
        polish: '润色',
        expand: '扩写',
        summarize: '总结',
        tone: '语气',
        selectedText: '选中文本',
        activeAnalysis: '活跃分析',
        askAi: '向 AI 提问...',
        poweredBy: '由 GLM-4.7 驱动',
        contextInfo: '在设置中配置 API',
        fixGrammar: '修复语法',
        makeConcise: '精简内容',
        translateToChinese: '翻译成中文',

        // 设置
        settingsTitle: '设置',
        cancel: '取消',
        save: '保存',
        aiProvider: 'AI 提供商',
        apiKey: 'API 密钥',
        apiEndpoint: 'API 端点',
        model: '模型',
        theme: '主题',
        language: '语言',

        // 提供商选项
        glmProvider: 'GLM (智谱 AI)',
        openaiProvider: 'OpenAI 兼容',

        // 占位符
        enterApiKey: '输入你的 API 密钥',
        apiEndpointPlaceholder: 'https://api.example.com/v1/chat/completions',
        modelPlaceholder: 'glm-4-flash',

        // 主题选项
        darkTheme: '深色',
        lightTheme: '浅色',
        customTheme: '自定义',

        // 自定义主题
        customThemeColors: '自定义主题颜色',
        backgroundColor: '背景色',
        textColor: '文字颜色',
        accentColor: '强调色',
        borderColor: '边框颜色',
        codeBgColor: '代码块背景',
        secondaryBgColor: '次要背景色',
        mutedTextColor: '次要文字颜色',

        // 语言选项
        chinese: '中文',
        english: 'English',

        // 编辑器
        editorPlaceholder: '在此处开始编写你的 Markdown...',

        // AI 面板底部文字
        aiFooter: '由 GLM-4.7 提供支持。在设置中配置 API。',

        // AI 聊天区域默认提示
        chatPlaceholder: '向 AI 提问...',

        // 工具栏按钮
        previewButton: '预览',
        saveButton: '保存',

        // 聊天欢迎消息
        chatWelcomeMessage: '向 AI 询问有关文档的任何问题'
    },
    en: {
        // 顶部导航
        appTitle: 'Markdown Studio',
        file: 'File',
        settings: 'Settings',
        searchFiles: 'Search files...',
        openFilePrompt: 'Enter file path to open:',
        saveFilePrompt: 'Enter file path to save:',

        // 左侧文件浏览器
        explorer: 'Explorer',
        newFile: 'New File',
        openFolder: 'Open Folder',

        // 编辑器工具栏
        preview: 'Preview',
        save: 'Save',
        publish: 'Publish',
        bold: 'Bold',
        italic: 'Italic',
        bulletList: 'Bullet List',
        numberedList: 'Numbered List',
        link: 'Link',
        image: 'Image',
        code: 'Code',

        // 状态栏
        allChangesSaved: 'All changes saved',
        unsavedChanges: 'Unsaved changes',
        saveFailed: 'Save failed',
        utf8: 'UTF-8',
        untitled: 'Untitled',
        untitledWithExt: 'Untitled.md',
        lines: 'Lines',
        words: 'Words',
        chars: 'Chars',
        wordCount: 'Words: 0',
        charCount: 'Chars: 0',
        aiReady: 'AI Ready',
        aiThinking: 'AI Thinking...',
        aiError: 'AI Error',
        connectedToAi: 'Connected to AI Engine',

        // AI 助手
        aiAssistant: 'AI Assistant',
        polish: 'Polish',
        expand: 'Expand',
        summarize: 'Summarize',
        tone: 'Tone',
        selectedText: 'Selected Text',
        activeAnalysis: 'Active Analysis',
        askAi: 'Ask AI anything...',
        poweredBy: 'Powered by GLM-4.7',
        contextInfo: 'Configure API in Settings',
        fixGrammar: 'Fix grammar',
        makeConcise: 'Make it concise',
        translateToChinese: 'Translate to Chinese',

        // 设置
        settingsTitle: 'Settings',
        cancel: 'Cancel',
        save: 'Save',
        aiProvider: 'AI Provider',
        apiKey: 'API Key',
        apiEndpoint: 'API Endpoint',
        model: 'Model',
        theme: 'Theme',
        language: 'Language',

        // 提供商选项
        glmProvider: 'GLM (Zhipu AI)',
        openaiProvider: 'OpenAI Compatible',

        // 占位符
        enterApiKey: 'Enter your API key',
        apiEndpointPlaceholder: 'https://api.example.com/v1/chat/completions',
        modelPlaceholder: 'glm-4-flash',

        // 主题选项
        darkTheme: 'Dark',
        lightTheme: 'Light',
        customTheme: 'Custom',

        // 自定义主题
        customThemeColors: 'Custom Theme Colors',
        backgroundColor: 'Background',
        textColor: 'Text',
        accentColor: 'Accent',
        borderColor: 'Border',
        codeBgColor: 'Code BG',
        secondaryBgColor: 'Secondary BG',
        mutedTextColor: 'Muted Text',

        // 语言选项
        chinese: '中文',
        english: 'English',

        // 编辑器
        editorPlaceholder: 'Start writing your Markdown here...',

        // AI 面板底部文字
        aiFooter: 'Powered by GLM-4.7. Configure API in Settings.',

        // AI 聊天区域默认提示
        chatPlaceholder: 'Ask AI anything...',

        // 工具栏按钮
        previewButton: 'Preview',
        saveButton: 'Save',

        // 聊天欢迎消息
        chatWelcomeMessage: 'Ask AI anything about your document'
    }
};

// 当前语言
let currentLanguage = 'zh';

// 获取翻译文本
function t(key) {
    return translations[currentLanguage][key] || key;
}

// 设置语言
function setLanguage(lang) {
    currentLanguage = lang;
    updatePageLanguage();
    saveLanguagePreference(lang);
}

// 更新页面语言
function updatePageLanguage() {
    // 顶部导航（app-title 不翻译，保持固定名称）
    updateText('btn-file', t('file'));
    updateText('btn-settings', t('settings'));

    // 工具栏按钮（带 title 属性）
    updateAttribute('btn-bold', 'title', t('bold') + ' (Ctrl+B)');
    updateAttribute('btn-italic', 'title', t('italic') + ' (Ctrl+I)');
    updateAttribute('btn-ul', 'title', t('bulletList'));
    updateAttribute('btn-ol', 'title', t('numberedList'));
    updateAttribute('btn-link', 'title', t('link'));
    updateAttribute('btn-image', 'title', t('image'));
    updateAttribute('btn-code', 'title', t('code'));

    // 左侧边栏
    updateText('explorer-title', t('explorer'));
    updateAttribute('btn-open-folder', 'title', t('openFolder'));
    updateText('new-file-text', t('newFile'));

    // 预览按钮（只更新文本span，不重复）
    updateText('preview-text', t('previewButton'));

    // 保存按钮
    updateText('save-text', t('saveButton'));

    // AI 助手
    updateText('ai-assistant-title', t('aiAssistant'));
    updateText('ai-polish', t('polish'));
    updateText('ai-expand', t('expand'));
    updateText('ai-summarize', t('summarize'));
    updateText('ai-tone', t('tone'));

    // AI 输入框
    const aiInput = document.getElementById('ai-input');
    if (aiInput) aiInput.placeholder = t('chatPlaceholder');

    // 聊天欢迎消息
    updateText('chat-welcome-message', t('chatWelcomeMessage'));

    // 编辑器占位符
    const editor = document.getElementById('markdown-editor');
    if (editor) editor.placeholder = t('editorPlaceholder');

    // AI 面板底部文字
    updateText('ai-footer-text', t('aiFooter'));

    // 状态栏
    updateHtml('save-status',
        '<span class="material-symbols-outlined text-xs">done_all</span>' + t('allChangesSaved')
    );
    updateText('current-file', t('untitledWithExt'));
    updateText('word-count', t('wordCount'));
    updateText('char-count', t('charCount'));
    updateHtml('ai-status',
        '<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>' + t('aiReady')
    );

    // 设置弹窗
    updateText('settings-title', t('settingsTitle'));
    updateText('btn-cancel', t('cancel'));
    updateText('btn-save-settings', t('save'));

    // 设置标签
    updateLabel('label-ai-provider', t('aiProvider'));
    updateLabel('label-api-key', t('apiKey'));
    updateLabel('label-api-endpoint', t('apiEndpoint'));
    updateLabel('label-model', t('model'));
    updateLabel('label-theme', t('theme'));
    updateLabel('label-language', t('language'));

    // 自定义主题标签
    updateText('custom-theme-title', t('customThemeColors'));
    updateLabel('label-bg-color', t('backgroundColor'));
    updateLabel('label-text-color', t('textColor'));
    updateLabel('label-accent-color', t('accentColor'));
    updateLabel('label-border-color', t('borderColor'));
    updateLabel('label-code-bg-color', t('codeBgColor'));
    updateLabel('label-secondary-bg-color', t('secondaryBgColor'));
    updateLabel('label-muted-text-color', t('mutedTextColor'));

    // 设置选项
    updateSelectOption('ai-provider', 'glm', t('glmProvider'));
    updateSelectOption('ai-provider', 'openai', t('openaiProvider'));
    updateSelectOption('app-theme', 'dark', t('darkTheme'));
    updateSelectOption('app-theme', 'light', t('lightTheme'));
    updateSelectOption('app-theme', 'custom', t('customTheme'));
    updateSelectOption('app-language', 'zh', t('chinese'));
    updateSelectOption('app-language', 'en', t('english'));

    // 占位符
    updatePlaceholder('ai-api-key', t('enterApiKey'));
    updatePlaceholder('ai-endpoint', t('apiEndpointPlaceholder'));
    updatePlaceholder('ai-model', t('modelPlaceholder'));

    // 更新当前语言选择
    const languageSelect = document.getElementById('app-language');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }

    // 触发自定义事件，通知其他模块语言已更改
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: currentLanguage } }));
}

// 辅助函数
function updateText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function updateHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

function updateTextContent(id, text) {
    const el = document.getElementById(id);
    if (el) {
        // 查找 span 元素
        const span = el.querySelector('span');
        if (span) {
            span.textContent = text;
        } else {
            el.textContent = text;
        }
    }
}

function updateAttribute(id, attr, value) {
    const el = document.querySelector(`[data-id="${id}"]`);
    if (el) el.setAttribute(attr, value);
}

function updateLabel(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function updatePlaceholder(id, text) {
    const el = document.getElementById(id);
    if (el) el.setAttribute('placeholder', text);
}

function updateSelectOption(selectId, value, text) {
    const select = document.getElementById(selectId);
    if (select) {
        const option = select.querySelector(`option[value="${value}"]`);
        if (option) option.textContent = text;
    }
}

function updateSaveStatus() {
    // 由其他函数处理
}

function updateAiStatus() {
    // 由其他函数处理
}

// 保存语言偏好
function saveLanguagePreference(lang) {
    localStorage.setItem('app-language', lang);
}

// 加载语言偏好
function loadLanguagePreference() {
    const saved = localStorage.getItem('app-language');
    if (saved && (saved === 'zh' || saved === 'en')) {
        setLanguage(saved);
    }
}

// 导出
window.t = t;
window.setLanguage = setLanguage;
window.loadLanguagePreference = loadLanguagePreference;
window.currentLanguage = () => currentLanguage;
