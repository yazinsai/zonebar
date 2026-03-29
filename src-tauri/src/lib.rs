use tauri::{
    image::Image,
    menu::{Menu, MenuItem},
    tray::{TrayIconBuilder, TrayIconEvent, MouseButtonState},
    Manager, WebviewWindow, Emitter,
};
use tauri_plugin_positioner::{WindowExt, Position};
use std::fs;
use std::path::PathBuf;

fn get_preferences_path(app: &tauri::AppHandle) -> PathBuf {
    let config_dir = app.path().app_config_dir().expect("failed to get config dir");
    config_dir.join("preferences.json")
}

#[tauri::command]
fn read_preferences(app: tauri::AppHandle) -> Result<String, String> {
    let path = get_preferences_path(&app);
    fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn resize_window(app: tauri::AppHandle, height: f64) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        let current_size = window.outer_size().map_err(|e| e.to_string())?;
        let scale = window.scale_factor().unwrap_or(1.0);
        let physical_height = (height * scale) as u32;
        let _ = window.set_size(tauri::Size::Physical(tauri::PhysicalSize {
            width: current_size.width,
            height: physical_height,
        }));
    }
    Ok(())
}

#[tauri::command]
fn write_preferences(app: tauri::AppHandle, data: String) -> Result<(), String> {
    let path = get_preferences_path(&app);
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(&path, data).map_err(|e| e.to_string())
}

fn toggle_popover(window: &WebviewWindow) {
    if window.is_visible().unwrap_or(false) {
        let _ = window.hide();
    } else {
        let _ = window.move_window(Position::TrayBottomCenter);
        let _ = window.show();
        let _ = window.set_focus();
        let _ = window.emit("popover-opened", ());
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![read_preferences, write_preferences, resize_window])
        .setup(|app| {
            // Hide from Dock on macOS
            #[cfg(target_os = "macos")]
            {
                app.set_activation_policy(tauri::ActivationPolicy::Accessory);
            }

            // Build tray icon
            let tray_icon = Image::from_bytes(include_bytes!("../icons/tray-icon.png"))
                .expect("failed to load tray icon");

            // Right-click menu with Quit
            let quit_item = MenuItem::with_id(app, "quit", "Quit ZoneBar", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&quit_item])?;

            TrayIconBuilder::new()
                .icon(tray_icon)
                .icon_as_template(true)
                .tooltip("ZoneBar")
                .menu(&menu)
                .menu_on_left_click(false)
                .on_menu_event(|app, event| {
                    if event.id.as_ref() == "quit" {
                        app.exit(0);
                    }
                })
                .on_tray_icon_event(move |tray_handle, event| {
                    tauri_plugin_positioner::on_tray_event(tray_handle.app_handle(), &event);
                    if let TrayIconEvent::Click { button_state, .. } = &event {
                        if matches!(button_state, MouseButtonState::Up) {
                            if let Some(window) = tray_handle.app_handle().get_webview_window("main") {
                                toggle_popover(&window);
                            }
                        }
                    }
                })
                .build(app)?;

            // Hide popover on focus loss
            if let Some(window) = app.get_webview_window("main") {
                let w = window.clone();
                window.on_window_event(move |event| {
                    if let tauri::WindowEvent::Focused(false) = event {
                        let _ = w.hide();
                    }
                });
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
