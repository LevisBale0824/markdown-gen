use crate::ai::{self};
use crate::config::{self, AppConfig};
use crate::file::{self, FileInfo};
use crate::watcher;
use tauri::{AppHandle, Manager};
use tauri_plugin_dialog::DialogExt;

// Current file state
struct CurrentFile {
    path: String,
    content: String,
}

/// 获取应用安装目录
#[tauri::command]
pub async fn get_app_dir(_app: AppHandle) -> Result<String, String> {
    let exe_dir = std::env::current_exe()
        .map_err(|e| e.to_string())?
        .parent()
        .ok_or("Cannot get parent directory")?
        .to_path_buf();
    Ok(exe_dir.to_string_lossy().to_string())
}

/// 启动文件监视
#[tauri::command]
pub async fn start_file_watcher(app: AppHandle, path: String) -> Result<(), String> {
    watcher::start_watcher(app, path)
}

// File operations
#[tauri::command]
pub async fn open_file(path: String) -> Result<String, String> {
    file::open_file(&path)
}

#[tauri::command]
pub async fn save_file(path: String, content: String) -> Result<(), String> {
    file::save_file(&path, &content)
}

#[tauri::command]
pub async fn read_directory(path: String) -> Result<Vec<FileInfo>, String> {
    file::read_directory(&path)
}

#[tauri::command]
pub async fn open_folder(path: String) -> Result<FolderContent, String> {
    let files = file::read_directory(&path)?;
    Ok(FolderContent { path, files })
}

#[derive(serde::Serialize)]
pub struct FolderContent {
    pub path: String,
    pub files: Vec<FileInfo>,
}

#[tauri::command]
pub async fn create_file(path: String) -> Result<(), String> {
    file::create_file(&path)
}

#[tauri::command]
pub async fn delete_file(path: String) -> Result<(), String> {
    file::delete_file(&path)
}

#[tauri::command]
pub async fn save_file_dialog(app: AppHandle, default_name: Option<String>) -> Result<Option<String>, String> {
    let mut builder = app.dialog().file();

    if let Some(name) = default_name {
        builder = builder.set_file_name(&name);
    }

    builder = builder.add_filter("Markdown Files", &["md", "txt", "markdown"]);

    match builder.blocking_save_file() {
        Some(path) => Ok(Some(path.to_string())),
        None => Ok(None),
    }
}

#[tauri::command]
pub async fn open_folder_dialog(app: AppHandle) -> Result<Option<String>, String> {
    match app.dialog().file().blocking_pick_folder() {
        Some(path) => Ok(Some(path.to_string())),
        None => Ok(None),
    }
}

// AI operations
#[tauri::command]
pub async fn ai_chat(
    message: String,
    context: String,
    app: AppHandle,
) -> Result<String, String> {
    let config_dir = app.path().app_config_dir().ok();
    let config = config::load_config(config_dir);

    if config.ai.api_key.is_empty() {
        return Err("API key not configured. Please set your API key in settings.".to_string());
    }

    ai::ai_chat(&message, &context, &config.ai).await
}

#[tauri::command]
pub async fn ai_suggest(
    text: String,
    action: String,
    app: AppHandle,
) -> Result<String, String> {
    let config_dir = app.path().app_config_dir().ok();
    let config = config::load_config(config_dir);

    if config.ai.api_key.is_empty() {
        return Err("API key not configured. Please set your API key in settings.".to_string());
    }

    ai::ai_suggest(&text, &action, &config.ai).await
}

// Config operations
#[tauri::command]
pub async fn get_config(app: AppHandle) -> Result<AppConfig, String> {
    let config_dir = app.path().app_config_dir().ok();
    Ok(config::load_config(config_dir))
}

#[tauri::command]
pub async fn save_config(app: AppHandle, config: AppConfig) -> Result<(), String> {
    let config_dir = app.path().app_config_dir().ok();
    config::save_config_to_file(config_dir, &config)
}

// Editor operations
#[tauri::command]
pub async fn count_words(content: String) -> usize {
    content.split_whitespace().count()
}

#[tauri::command]
pub async fn count_chars(content: String) -> usize {
    content.chars().count()
}
