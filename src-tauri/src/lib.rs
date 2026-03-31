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
fn toggle_popup(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(main) = app.get_webview_window("main") {
        if main.is_visible().unwrap_or(false) {
            let _ = main.hide();
        } else {
            if let Some(bar) = app.get_webview_window("bar") {
                if let (Ok(bar_pos), Ok(bar_size), Ok(main_size)) = (
                    bar.outer_position(),
                    bar.outer_size(),
                    main.outer_size(),
                ) {
                    let x = bar_pos.x + bar_size.width as i32 - main_size.width as i32;
                    let y = bar_pos.y - main_size.height as i32 - 4;
                    let _ = main.set_position(tauri::Position::Physical(
                        tauri::PhysicalPosition { x: x.max(0), y: y.max(0) },
                    ));
                }
            }
            let _ = main.show();
            let _ = main.set_focus();
            let _ = main.emit("popover-opened", ()).ok();
        }
    }
    Ok(())
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

fn toggle_popover(window: &WebviewWindow, tray_bounds: Option<(f64, f64, f64, f64)>) {
    if window.is_visible().unwrap_or(false) {
        let _ = window.hide();
    } else {
        #[cfg(target_os = "windows")]
        {
            // On Windows the taskbar is at the bottom, so TrayBottomCenter would place
            // the window below the screen. Instead, right-align to the tray icon and
            // appear above it — matching Windows convention (Action Center, calendar, etc.).
            if let Some((tray_x, tray_y, tray_w, _)) = tray_bounds {
                if let Ok(win_size) = window.outer_size() {
                    // Right edge of window aligns with right edge of tray icon
                    let x = (tray_x + tray_w) as i32 - win_size.width as i32;
                    let y = tray_y as i32 - win_size.height as i32;
                    let _ = window.set_position(tauri::Position::Physical(
                        tauri::PhysicalPosition { x: x.max(0), y: y.max(0) },
                    ));
                }
            } else {
                let _ = window.move_window(Position::TrayCenter);
            }
        }
        #[cfg(not(target_os = "windows"))]
        {
            let _ = window.move_window(Position::TrayBottomCenter);
        }
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
        .invoke_handler(tauri::generate_handler![read_preferences, write_preferences, resize_window, toggle_popup])
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
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| {
                    if event.id.as_ref() == "quit" {
                        app.exit(0);
                    }
                })
                .on_tray_icon_event(move |tray_handle, event| {
                    tauri_plugin_positioner::on_tray_event(tray_handle.app_handle(), &event);
                    if let TrayIconEvent::Click { button_state, rect, .. } = &event {
                        if matches!(button_state, MouseButtonState::Up) {
                            if let Some(window) = tray_handle.app_handle().get_webview_window("main") {
                                let (tray_x, tray_y) = match &rect.position {
                                    tauri::Position::Physical(p) => (p.x as f64, p.y as f64),
                                    tauri::Position::Logical(l) => (l.x, l.y),
                                };
                                let (tray_w, tray_h) = match &rect.size {
                                    tauri::Size::Physical(s) => (s.width as f64, s.height as f64),
                                    tauri::Size::Logical(s) => (s.width, s.height),
                                };
                                toggle_popover(&window, Some((tray_x, tray_y, tray_w, tray_h)));
                            }
                        }
                    }
                })
                .build(app)?;

            // Hide popover on focus loss (main popup only, not the bar)
            if let Some(window) = app.get_webview_window("main") {
                let w = window.clone();
                window.on_window_event(move |event| {
                    if let tauri::WindowEvent::Focused(false) = event {
                        let _ = w.hide();
                    }
                });
            }

            // On Windows: position and show the always-visible taskbar bar
            #[cfg(target_os = "windows")]
            {
                if let Some(bar) = app.get_webview_window("bar") {
                    if let Ok(Some(monitor)) = bar.primary_monitor() {
                        let scale = bar.scale_factor().unwrap_or(1.0);
                        let phys = monitor.size();
                        // Convert screen size to logical pixels for positioning
                        let screen_w = phys.width as f64 / scale;
                        let screen_h = phys.height as f64 / scale;
                        // Windows taskbar is ~40px (Win10) or ~48px (Win11), clock ~130px wide
                        let taskbar_h = 48.0f64;
                        let clock_w  = 130.0f64;
                        let bar_w    = 300.0f64;
                        let bar_h    = 40.0f64;
                        let x = screen_w - bar_w - clock_w;
                        let y = screen_h - taskbar_h + (taskbar_h - bar_h) / 2.0;
                        let _ = bar.set_position(tauri::Position::Logical(
                            tauri::LogicalPosition { x, y },
                        ));
                        let _ = bar.show();
                    }
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
