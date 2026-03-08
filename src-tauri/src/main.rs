// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod ai;
mod file;
mod config;

use commands::*;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            // Initialize default config if not exists
            config::init_config(app.path().app_config_dir().ok());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // File operations
            open_file,
            save_file,
            read_directory,
            create_file,
            delete_file,
            save_file_dialog,
            // AI operations
            ai_chat,
            ai_suggest,
            // Config operations
            get_config,
            save_config,
            // Editor operations
            count_words,
            count_chars,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
