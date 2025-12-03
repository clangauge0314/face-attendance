const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  minimize: () => ipcRenderer.send("window:minimize"),
  maximize: () => ipcRenderer.send("window:maximize"),
  close: () => ipcRenderer.send("window:close"),
  onNavigateToAdmin: (callback) => {
    ipcRenderer.on("navigate-to-admin", callback);
  },
  removeNavigateToAdminListener: (callback) => {
    ipcRenderer.removeListener("navigate-to-admin", callback);
  },
});
