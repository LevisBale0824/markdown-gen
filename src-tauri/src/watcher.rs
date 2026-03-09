use notify::{Config, RecommendedWatcher, RecursiveMode, Watcher, Event, EventKind};
use std::path::Path;
use std::sync::mpsc::{channel, Receiver};
use std::time::Duration;
use tauri::{AppHandle, Emitter};

/// 文件变更事件
#[derive(Debug, Clone, serde::Serialize)]
pub struct FileChangeEvent {
    pub kind: String,
    pub paths: Vec<String>,
}

impl From<Event> for FileChangeEvent {
    fn from(event: Event) -> Self {
        let kind = match event.kind {
            EventKind::Create(_) => "create",
            EventKind::Modify(_) => "modify",
            EventKind::Remove(_) => "remove",
            _ => "other",
        };

        // 过滤只保留文本文件
        let text_extensions = ["md", "txt", "markdown", "json", "yaml", "yml", "toml", "xml", "html", "css", "js", "ts"];
        let paths: Vec<String> = event.paths
            .iter()
            .filter(|p| {
                if let Some(ext) = p.extension().and_then(|e| e.to_str()) {
                    text_extensions.contains(&ext.to_lowercase().as_str())
                } else {
                    false
                }
            })
            .filter_map(|p| p.to_str().map(|s| s.to_string()))
            .collect();

        FileChangeEvent {
            kind: kind.to_string(),
            paths,
        }
    }
}

/// 文件监视器
pub struct FileWatcher {
    #[allow(dead_code)]
    watcher: RecommendedWatcher,
    receiver: Receiver<Result<Event, notify::Error>>,
}

impl FileWatcher {
    /// 创建新的文件监视器
    pub fn new() -> Result<Self, String> {
        let (tx, rx) = channel();

        let watcher = RecommendedWatcher::new(
            move |res| {
                let _ = tx.send(res);
            },
            Config::default().with_poll_interval(Duration::from_millis(500)),
        ).map_err(|e| e.to_string())?;

        Ok(Self {
            watcher,
            receiver: rx,
        })
    }

    /// 开始监视指定目录
    pub fn watch(&mut self, path: &str) -> Result<(), String> {
        let path = Path::new(path);
        if !path.exists() {
            return Err(format!("Path does not exist: {}", path.display()));
        }

        self.watcher.watch(path, RecursiveMode::Recursive)
            .map_err(|e| e.to_string())?;

        Ok(())
    }

    /// 尝试获取文件变更事件（非阻塞）
    pub fn try_recv(&self) -> Option<FileChangeEvent> {
        if let Ok(Ok(event)) = self.receiver.try_recv() {
            let change = FileChangeEvent::from(event);
            // 只返回有实际文件的事件
            if !change.paths.is_empty() {
                return Some(change);
            }
        }
        None
    }
}

/// 启动文件监视（后台任务）
pub fn start_watcher(app: AppHandle, path: String) -> Result<(), String> {
    let mut watcher = FileWatcher::new()?;
    watcher.watch(&path)?;

    // 在后台线程中轮询并发送事件
    std::thread::spawn(move || {
        loop {
            if let Some(event) = watcher.try_recv() {
                let _ = app.emit("file-change", event);
            }
            std::thread::sleep(Duration::from_millis(100));
        }
    });

    Ok(())
}
