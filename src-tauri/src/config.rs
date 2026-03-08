use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppConfig {
    pub ai: AiConfig,
    pub theme: String,
    #[serde(skip)]
    pub last_path: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AiConfig {
    pub provider: String,
    pub api_key: String,
    pub api_endpoint: String,
    pub model: String,
    pub max_tokens: u32,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            ai: AiConfig {
                provider: "glm".to_string(),
                api_key: String::new(),
                api_endpoint: "https://open.bigmodel.cn/api/paas/v4/chat/completions".to_string(),
                model: "glm-4-flash".to_string(),
                max_tokens: 4096,
            },
            theme: "dark".to_string(),
            last_path: String::new(),
        }
    }
}

pub fn get_config_path(config_dir: Option<PathBuf>) -> Option<PathBuf> {
    let mut path = config_dir?;
    path.push("config.json");
    Some(path)
}

pub fn load_config(config_dir: Option<PathBuf>) -> AppConfig {
    let config_path = get_config_path(config_dir);

    if let Some(path) = config_path {
        if path.exists() {
            if let Ok(content) = fs::read_to_string(&path) {
                if let Ok(config) = serde_json::from_str::<AppConfig>(&content) {
                    return config;
                }
            }
        }
    }

    AppConfig::default()
}

pub fn save_config_to_file(config_dir: Option<PathBuf>, config: &AppConfig) -> Result<(), String> {
    let config_path = get_config_path(config_dir)
        .ok_or("Failed to get config path".to_string())?;

    // Ensure directory exists
    if let Some(parent) = config_path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create config directory: {}", e))?;
    }

    let content = serde_json::to_string_pretty(config)
        .map_err(|e| format!("Failed to serialize config: {}", e))?;

    fs::write(&config_path, content)
        .map_err(|e| format!("Failed to write config: {}", e))?;

    Ok(())
}

pub fn init_config(config_dir: Option<PathBuf>) {
    let config = load_config(config_dir.clone());
    let _ = save_config_to_file(config_dir, &config);
}
