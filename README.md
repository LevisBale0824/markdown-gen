# Markdown Studio Pro

一款现代化的跨平台 Markdown 编辑器，集成 AI 助手功能，基于 Tauri 2.0 构建。

## 功能特性

- **Markdown 编辑** - 功能完整的 Markdown 编辑器，支持实时预览
  - 三种视图模式：编辑、分栏、预览
  - 语法高亮（highlight.js）
  - 快捷键支持
- **AI 助手** - 集成 GLM-4 或 OpenAI 兼容 API 的智能助手
  - 润色文本
  - 扩写内容
  - 总结文章
  - 调整语气
- **文件浏览器** - 内置文件管理器，轻松管理文档
- **多语言支持** - 支持中文和英文界面
- **主题切换** - 支持浅色、深色和自定义主题

## 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | TypeScript + Tailwind CSS + Vite |
| **后端** | Rust + Tauri 2.0 |
| **AI 集成** | GLM-4 (智谱 AI) / OpenAI 兼容 API |
| **Markdown 解析** | marked.js |
| **代码高亮** | highlight.js |

## 项目结构

```
markdown-gen/
├── src/                          # 前端源代码
│   ├── index.html                # 主页面入口
│   ├── styles.css                # 自定义样式
│   └── ts/                       # TypeScript 源码
│       ├── main.ts               # 应用入口，服务注册和初始化
│       ├── core/                 # 核心基础设施
│       │   ├── container.ts      # 依赖注入容器
│       │   ├── tauri-bridge.ts   # Tauri API 桥接层
│       │   └── index.ts          # 核心模块导出
│       ├── modules/              # 业务模块
│       │   ├── editor/           # Markdown 编辑器模块
│       │   ├── ai-assistant/     # AI 助手模块
│       │   ├── file-explorer/    # 文件浏览器模块
│       │   ├── app/              # 主应用逻辑
│       │   └── i18n/             # 国际化模块
│       └── types/                # TypeScript 类型定义
├── src-tauri/                    # Tauri/Rust 后端
│   ├── src/
│   │   ├── main.rs               # 应用入口和 Tauri 配置
│   │   ├── commands.rs           # Tauri 命令处理
│   │   ├── ai.rs                 # AI API 客户端
│   │   ├── file.rs               # 文件操作
│   │   ├── config.rs             # 配置管理
│   │   └── watcher.rs            # 文件监视器
│   ├── Cargo.toml                # Rust 依赖配置
│   ├── tauri.conf.json           # Tauri 应用配置
│   └── capabilities/             # Tauri 权限配置
├── dist/                         # Vite 构建输出
├── package.json                  # Node.js 项目配置
├── tsconfig.json                 # TypeScript 配置
└── vite.config.ts                # Vite 构建配置
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

## 架构特点

- **模块化设计** - 前端采用依赖注入容器（DI Container）管理服务，各模块解耦
- **桥接模式** - 通过 `tauri-bridge.ts` 封装 Tauri API，前端与原生后端通信
- **前后端分离** - TypeScript 负责所有 UI 和交互逻辑，Rust 负责文件系统、AI API 调用等原生能力
- **响应式 UI** - 使用 Tailwind CSS，支持深色/浅色主题切换

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
