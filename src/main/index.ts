import { app, shell, BrowserWindow, ipcMain, session, ipcRenderer } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

let mainWindow
console.log('isdev', is.dev)
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ✅ Add this function to handle deep links
function handleDeepLink(url: string) {
  // if (!url || typeof url !== "string" || !url.startsWith("electron-app://")) {
  //   console.error("Invalid deep link URL:", url);
  //   return;
  // }
  // let url='electron-app://contest?cb_auth=test&one_auth=test&contestId=6&contentId=1'
  console.log('Received deep link:', url)
  // Parse the URL and extract parameters
  const params = new URLSearchParams(new URL(url).search)
  const cb_auth = params.get('cb_auth')
  const one_auth = params.get('one_auth')
  const contestId = params.get('contestId') || 'default_contest_id'
  const contentId = params.get('contentId') || '1' // Default to 1

  // console.log("CB Auth:", cb_auth);
  // console.log("One Auth:", one_auth);
  // console.log("Contest ID:", contestId);
  // console.log("Content ID:", contentId);

  // ✅ Send data to renderer (frontend)
  if (mainWindow) {
    mainWindow.webContents.send('deep-link-data', { cb_auth, one_auth, contestId, contentId })
  }

  const appURL = is.dev ? 'http://localhost:5173' : 'electron-app://'
  mainWindow.webContents.executeJavaScript(`
    localStorage.setItem("cb_auth", "${cb_auth}");
    localStorage.setItem("one_auth", "${one_auth}");
    localStorage.setItem("contestId", "${contestId}");
    localStorage.setItem("contentId", "${contentId}");

  `)

  // ipcRenderer.send("send-auth-data", {
  //   cb_auth: localStorage.getItem("cb_auth"),
  //   one_auth: localStorage.getItem("one_auth"),
  // });
}

// ✅ Register the deep link protocol
app.setAsDefaultProtocolClient('electron-app')

// app.on("open-url", (event, url) => {
//   event.preventDefault();
//   handleDeepLink(url);
// });
app.on('open-url', (event, url) => {
  event.preventDefault()
  const routePath = url.replace('electron-app://', '') // Extract route
  if (mainWindow) {
    mainWindow.webContents.send('open-url', routePath)
    handleDeepLink(url)
  }
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // ✅ Handle deep link when app is launched from a URL
  if (process.argv.length > 1) {
    handleDeepLink(process.argv[1])
  }
})

// Quit when all windows are closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
