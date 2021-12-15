// "use strict";

import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import * as path from 'path'
import log from 'electron-log'
import { format as formatUrl } from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production'

let mainWindowMinisize = false
// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow
// Don’t show error popup to users
process.on('uncaughtException', (error) => {
  log.info(error)
})
// const gConf = {}
// let dir = path.join(process.cwd(), '/', __dirname)
if (process.env.NODE_ENV !== 'development') {
  // const sourceMapSupport = require("source-map-support");
  // gConf.resPath = `file://${dir}/res_${app.getVersion()}.asar/`
  // sourceMapSupport.install();
} else {
  // electron开发环境 忽略证书错误
  app.commandLine.appendSwitch('--ignore-certificate-errors', 'true')
  // gConf.resPath = `file://${path.join(dir, '..', 'renderer')}/`
}
// 人机交互f
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')
app.commandLine.appendSwitch('disable-site-isolation-trials')
// if (LocalStorage.getItem('hardwareSpeedup') && LocalStorage.getItem('hardwareSpeedup').hardwareSpeedup === false) {
  app.disableHardwareAcceleration()
// }
app.allowRendererProcessReuse = false
// 请求单例锁
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // 当运行第二个实例时, 将会聚焦到mainWindow这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
  })

  app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
      createMainWindow()
    }
  })

  // create main BrowserWindow when electron is ready
  app.on('ready', () => {
    createMainWindow()
  })

  app.on('browser-window-focus', () => {
    // 注册快捷键：DevTools
    globalShortcut.register('alt+CommandOrControl+]', () => {
      let win = BrowserWindow.getFocusedWindow()
      if (!(win && win.webContents)) return
      if (win.webContents.isDevToolsOpened()) {
        win.webContents.closeDevTools()
      } else {
        win.webContents.openDevTools()
      }
    })
  })

  app.on('browser-window-blur', () => {
    // 注销快捷键
    globalShortcut.unregister('alt+CommandOrControl+]')
  })
  // 主进程所有的窗口已经关闭
  app.on('window-all-closed', () => {
    // 清空所有快捷键
    globalShortcut.unregisterAll()

    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
      app.quit()
    }
    app.exit(3) // 考虑到一键唤起   在mac上点x直接退出程序
  })
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    minWidth: 1252,
    minHeight: 740,
    width: 1920,
    height: 1080,
    // fullscreen: true,
    // simpleFullscreen: true,
    x: 0,
    y: 0,
    resizable: true,
    movable: true,
    alwaysOnTop: false,
    backgroundColor: '#507cff',
    autoHideMenuBar: true,
    webPreferences: {
      disableHtmlFullscreenWindowResize: true,
      nodeIntegration: true,
      webSecurity: false,
      //由于安全问题，remote模块默认关闭
      enableRemoteModule: true, //开启remote模块
      webviewTag: true,
    },
    title: '火',
  })
  log.info( 'loadurl is ', path.join(__dirname, 'index.html'))
  // mainWindow.removeMenu()
  global.mainWindow = mainWindow
//   init(mainWindow)
  if (isDevelopment) {
    mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    mainWindow.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      })
    )
  }

  mainWindow.webContents.on('did-finish-load', (e) => {
    // throw new Error(' did-finish-load is not fail ', e)
    // if (!mainWindow) {
    //     throw new Error('"mainWindow" is not defined');
    // }
  })
  mainWindow.webContents.on('did-fail-load', (e) => {
    // throw new Error('did-fail-load  is not fail ', e)
  })
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if(input.alt){
      event.preventDefault();
    }
     mainWindow.webContents.setIgnoreMenuShortcuts(input.alt);
   })
  mainWindow.on('ready-to-show', () => {
    if (process.platform === 'darwin') {
      if (process.env.NODE_ENV != 'development') {
        mainWindow.setSimpleFullScreen(true)
      }
    } else {
      mainWindow.setFullScreen(true)
    }
    mainWindow.setResizable(false)
    // if (process.env.NODE_ENV === 'production') {
    // mainWindow.setMovable(false)
    // }
    mainWindow.show()
    mainWindow.focus()
    if (process.env.REACT_APP_ENV !== 'prod') {
      // mainWindow.webContents.openDevTools()
    }
  })
  mainWindow.on('maximize', () => {
    // console.log('mainWindow  maximize ')
    mainWindow.webContents.send('maximize', {})
    if (mainWindowMinisize) {
      mainWindow.restore()
      mainWindowMinisize = false
    }
  })
  mainWindow.on('minimize', () => {
    // console.log('mainWindow  minimize ')
    mainWindowMinisize = true
    mainWindow.webContents.send('minimize', {})
  })
  mainWindow.on('restore', (e) => {
    mainWindow.webContents.send('restore', {})
  })
  mainWindow.on('close', (e) => {
    try {
      mainWindow.webContents.send('close')
      e.preventDefault()
    } catch (e) {
      sentry.captureMessage(' mainWindow.webContents ', JSON.stringify(e))
    //   console.log('mainWindow.error after ', e)
    }
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // 自定义监听事件
  ipcMain.on('exitClient', () => app.exit()) // 退出
  ipcMain.on('minimizeClient', () => mainWindow.minimize()) // 最小化
  // MenuBuilder()
}
