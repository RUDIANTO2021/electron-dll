由于公司 `.net` 同事离职, 于是前端开发的我开启了 `electron` 的踩坑之旅

## 1. 项目初始化

执行 `npm init` 进行项目初始化, 会生成一个 `pakeage.json` 文件, 这个文件主要记录项目的详细信息, 以及项目依赖, 可以加上 `-y` 生成一个默认配置

```
npm init -y
```

## 2. 安装 `electron`

将 `electron` 包安装到应用的开发依赖中

```
npm install --save-dev electron
```
也可以指定版本安装
```
npm install --save-dev electron@13.0.0
```
如果想修改下载安装的位版本(例如, 在`x64`机器上安装`ia32`位版本), 你可以使用npm install中的`--arch`标记，或者设置`npm_config_arch` 环境变量:
```
npm install --arch=ia32 --save-dev electron
```

## 3. 运行主进程

#### 创建页面
在可以为我们的应用创建窗口前，我们需要先创建加载进该窗口的内容。 在 Electron 中，每个窗口中无论是本地的HTML文件还是远程URL都可以被加载显示。

这里我们使用官方文档提供的模板页面

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <meta http-equiv="X-Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    We are using Node.js <span id="node-version"></span>,
    Chromium <span id="chrome-version"></span>,
    and Electron <span id="electron-version"></span>.
  </body>
</html>
```

#### 准备入口文件

任何 Electron 应用程序的入口都是 `main` 文件。 这个文件控制了**主进程**，它运行在一个完整的Node.js环境中，负责控制您应用的生命周期，显示原生界面

执行期间，Electron 将依据应用中 `package.json`配置下[`main`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#main)字段中配置的值查找此文件

要初始化这个`main`文件，需要在您项目的根目录下创建一个名为`main.js`的空文件。

```javascript
// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow } = require('electron')

function createWindow () {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  // 加载 index.html
  mainWindow.loadFile('index.html')

  // 打开开发工具
  // mainWindow.webContents.openDevTools()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// 在这个文件中，你可以包含应用程序剩余的所有部分的代码，
// 也可以拆分成几个文件，然后用 require 导入。
```

#### 运行程序

最后，您希望能够执行 Electron 如下所示，在您的 [`package.json`](https://docs.npmjs.com/cli/v7/using-npm/scripts)配置文件中的`scripts`字段下增加一条`start`命令：

```
{
  "scripts": {
    "dev": "electron ."
  }
}
```
`dev` 命令能让您在开发模式下打开您的应用

```
npm run dev
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8c8d23a487b42caa389fc51c71f2ae5~tplv-k3u1fbpfcp-watermark.image?)

