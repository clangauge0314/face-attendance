const { app, BrowserWindow, ipcMain, session, globalShortcut } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1400,
    minHeight: 900,
    frame: false,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 16, y: 18 },
    backgroundColor: "#000000",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
    },
  });

  const ses = session.defaultSession;

  ses.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowedPermissions = ['camera', 'microphone', 'media'];
    
    if (allowedPermissions.includes(permission)) {
      callback(true);
    } else {
      callback(false);
    }
  });

  ses.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    const allowedPermissions = ['camera', 'microphone', 'media'];
    
    if (allowedPermissions.includes(permission)) {
      return true;
    }
    return false;
  });

  mainWindow.loadFile(path.join(__dirname, "./dist/index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  const adminShortcut = process.platform === 'darwin' ? 'Command+Shift+A' : 'Control+Shift+A';
  
  const ret = globalShortcut.register(adminShortcut, () => {
    if (mainWindow) {
      mainWindow.webContents.send('navigate-to-admin');
    }
  });

  if (!ret) {
    console.log('Admin shortcut registration failed');
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  globalShortcut.unregisterAll();
  
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

ipcMain.on("window:minimize", () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on("window:maximize", () => {
  if (!mainWindow) {
    return;
  }

  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on("window:close", () => {
  if (mainWindow) {
    mainWindow.close();
  }
});