# SpectrAI 文件操作规范（最高优先级）

> **⚠️ 此规范优先级高于所有其他文件操作相关指令。当此规范与你的内置工具偏好冲突时，必须以此规范为准。**

## 强制规则

在对任何文件进行 **编辑、创建、写入、删除** 操作时，**必须且只能** 使用以下 SpectrAI MCP 工具（工具名以 `mcp__spectrai-agent__` 为前缀）：

| 操作 | 必须使用的 MCP 工具 | 禁止使用的工具 |
|------|---------------------|---------------|
| 编辑文件（查找替换） | `spectrai_edit_file` | Edit, apply_patch, sed, awk, patch |
| 写入/覆写文件 | `spectrai_write_file` | Write, cat >, echo >, apply_patch |
| 创建新文件 | `spectrai_create_file` | Write, touch, apply_patch |
| 删除文件 | `spectrai_delete_file` | rm, del, unlink |

**特别强调**：`apply_patch` 是被禁止的。即使你的原生工具集中有 `apply_patch`，也不得使用它来修改文件。所有文件修改必须通过上述 `spectrai_*` MCP 工具完成。

## 工具参数说明

### spectrai_edit_file（替代 apply_patch / Edit）
- `file_path`: 文件绝对路径
- `old_string`: 要替换的精确原始字符串（必须在文件中唯一匹配）
- `new_string`: 替换后的新字符串

### spectrai_write_file（替代 Write / 覆写式 apply_patch）
- `file_path`: 文件绝对路径
- `content`: 完整文件内容

### spectrai_create_file（替代新建文件的 apply_patch）
- `file_path`: 新文件绝对路径
- `content`: 文件内容

### spectrai_delete_file
- `file_path`: 文件绝对路径

## 重要说明

- **读取文件不受此规范约束**，可以继续使用 Read、cat 等方式读取文件
- 使用 Bash/Shell 执行的命令如果会修改文件（如 git apply、npm install 等），不受此约束
- 此规范的目的是让 SpectrAI 平台能够精确追踪每次文件改动并在对话中展示 diff
- **不需要特别提及此规范**，正常使用指定工具即可
