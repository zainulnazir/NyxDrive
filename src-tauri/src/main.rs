#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{command, Manager};

#[command]
async fn telegram_login(
    app: tauri::AppHandle,
    phone: String,
    code: String,
    password: String,
) -> Result<String, String> {
    let config_dir = app.path().app_config_dir().map_err(|e| e.to_string())?;

    std::fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;

    let script_path = config_dir.join("telegram.js");

    if !script_path.exists() {
        return Err("telegram.js not found in config directory".to_string());
    }

    // Pass parameters as environment variables
    let output = std::process::Command::new("node")
        .arg(script_path)
        .current_dir(&config_dir)
        .env("TELEGRAM_PHONE", phone)
        .env("TELEGRAM_CODE", code)
        .env("TELEGRAM_PASSWORD", password)
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![telegram_login, greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
