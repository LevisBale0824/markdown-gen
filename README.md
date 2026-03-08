# Markdown Studio Pro

一款现代化的跨平台 Markdown 编辑器，集成 AI 助手功能，基于 Tauri 2.0 构建。

## 功能特性

- **Markdown 编辑** - 功能完整的 Markdown 编辑器，支持实时预览
- **AI 助手** - 集成 GLM-4 或 OpenAI 兼容 API 的智能助手
  - 润色文本
  - 扩写内容
  - 总结文章
  - 调整语气
- **文件浏览器** - 内置文件管理器，轻松管理文档
- **语法高亮** - 支持 highlight.js 代码块高亮
- **多语言支持** - 支持中文和英文界面
- **主题切换** - 支持浅色、深色和自定义主题
- **快捷键** - 支持 Ctrl+B、Ctrl+I、Ctrl+S 等快捷操作

## 技术栈

- **前端**: HTML, CSS (Tailwind CSS), 原生 JavaScript
- **后端**: Rust (Tauri 2.0)
- **AI 集成**: GLM-4 (智谱 AI) / OpenAI 兼容 API

## 项目结构

```
markdown-gen/
├── src/                    # 前端源代码
│   ├── index.html          # 主页面入口
│   ├── styles.css          # 自定义样式
│   └── js/
│       ├── main.js         # 入口文件
│       ├── app.js          # 主应用逻辑
│       ├── editor.js       # Markdown 编辑器功能
│       ├── ai.js           # AI 助手集成
│       ├── file-explorer.js # 文件浏览器功能
│       └── i18n.js         # 国际化支持
├── src-tauri/              # Tauri/Rust 后端
│   ├── src/
│   │   ├── main.rs         # 应用入口
│   │   ├── ai.rs           # AI API 客户端
│   │   ├── file.rs         # 文件操作
│   │   ├── config.rs       # 配置管理
│   │   └── commands.rs     # Tauri 命令处理
│   ├── Cargo.toml          # Rust 依赖
│   └── tauri.conf.json     # Tauri 配置
└── package.json            # Node.js 依赖
```

## 环境要求

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/) (最新稳定版)
- [Tauri CLI](https://tauri.app/v2/guide/) (v2)

## 安装与运行

```bash
# 克隆仓库
git clone https://github.com/yourusername/markdown-gen.git
cd markdown-gen

# 安装依赖
npm install

# 开发模式运行
npm run tauri dev

# 生产环境构建
npm run tauri build
```

## 配置说明

### AI 提供商设置

1. 从顶部导航打开设置
2. 选择 AI 提供商：
   - **GLM (智谱 AI)** - 默认选项，使用 glm-4-flash 模型
   - **OpenAI 兼容** - 支持其他 OpenAI 兼容 API
3. 输入 API 密钥
4. 配置 API 端点（默认：`https://open.bigmodel.cn/api/paas/v4/chat/completions`）
5. 选择模型（默认：`glm-4-flash`）

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl+S | 保存文件 |
| Ctrl+B | 加粗 |
| Ctrl+I | 斜体 |
| Ctrl+O | 打开文件 |
| Ctrl+N | 新建文件 |
| Escape | 关闭弹窗 |

## 开发

```bash
# 全局安装 Tauri CLI（可选）
npm install -g @tauri-apps/cli

# 开发模式
npm run tauri dev

# 构建发布版本
npm run tauri build
```

## 许可证

MIT License

## 致谢

- [Tauri](https://tauri.app/) - 跨平台桌面应用框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [marked](https://marked.js.org/) - Markdown 解析器
- [highlight.js](https://highlightjs.org/) - 语法高亮
- [GLM-4](https://open.bigmodel.cn/) - 智谱 AI 大模型
