const { contextBridge, ipcRenderer } = require("electron");
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electron', {
  
      onDeepLinkData: (callback: (data: { cb_auth?: string; one_auth?: string }) => void) => {
        ipcRenderer.on('deep-link-data', (_, data) => callback(data))
      },
      process: {
        versions: process.versions,
      },
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
