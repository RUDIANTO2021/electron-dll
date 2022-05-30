# electron 踩坑之旅(一)  —— 项目初体验

> [掘金博客地址](https://juejin.cn/post/7035239602981961764)

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

#### 通过预加载脚本从渲染器访问Node.js
现在，最后要做的是输出Electron的版本号和它的依赖项到你的web页面上。

在主进程通过Node的全局 `process` 对象访问这个信息是微不足道的。 然而，你不能直接在主进程中编辑DOM，因为它无法访问渲染器 `文档` 上下文。 它们存在于完全不同的进程！

这是将 **预加载** 脚本连接到渲染器时派上用场的地方。 预加载脚本在渲染器进程加载之前加载，并有权访问两个 渲染器全局 (例如 `window` 和 `document`) 和 Node.js 环境。

创建一个名为 `preload.js` 的新脚本如下：

```
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
```

上面的代码访问 Node.js `process.versions` 对象，并运行一个基本的 `replaceText` 辅助函数将版本号插入到 HTML 文档中。

要将此脚本附加到渲染器流程，请在你现有的 `BrowserWindow` 构造器中将路径中的预加载脚本传入 `webPreferences.preload` 选项。

```
// 在文件头部引入 Node.js 中的 path 模块
const path = require('path')

// 修改现有的 createWindow() 函数
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}
// ...
```

运行程序

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33a31820c28b4081bc809da0a8e0a49b~tplv-k3u1fbpfcp-watermark.image?)

# electron 踩坑之旅(二) —— 调用 .Net 的 DLL

`.net` 同事虽然离职了, 但是他的传说依然流传, 之前他封装好的许多方法还是可以直接拿来用的, 那么如何调用 .Net 方法就成为了关键

## 调用 `.Net Dll`

Nodejs 中调用 C# dll 可以使用 `edge.js`

`Electron` 是使用Node.js的特定版本构建的, 为了在 `Electron` 项目中使用 `edge.js` , 我们需要使用相同的 `Node.js` 版本 和 `Electron` 头文件 重新编译它

#### 安装 electron-edge-js

`electronic-edge-js` 带有正确的Node.js版本和头文件。

```
npm install electron-edge-js --save
```

#### 使用

`html` 中添加一个按钮
```html
<button id="btn">按钮</button>
```
`preload.js` 中监听按钮点击事件

```javascript
var edge = require('electron-edge-js');
window.onload = function () {
  const btn = document.getElementById('btn')
  btn.onclick = function () {
    var helloWorld = edge.func(function () {/*
    async (input) => {
        return ".NET Welcomes " + input.ToString();
    }
*/});
    helloWorld('Electron', (error, value) => {
      console.log(error, value)
    })
  }
}
```

#### 报错

重新运行程序会发现报错了

```shell
The edge module has not been pre-compiled for Electron version 16.0.2  . You must build a custom version of edge.node. Please refer to https://github.com/agracio/edge-js for building instructions.
```

这是因为 `electron-edge-js` 还未提供 `Electron version 16.0.2`  对应版本

[查阅官网](https://www.npmjs.com/package/electron-edge-js)可以看到对应版本信息

-   Electron 2.x - Node.js v8.9.3.
-   Electron 3.x - Node.js v10.2.0.
-   Electron 4.0.4+ - Node.js v10.11.0.
-   Electron 5.x - Node.js v12.0.0.
-   Electron 6.x - Node.js v12.4.0.
-   Electron 7.x - Node.js v12.8.1
-   Electron 8.x - Node.js v12.13.0
-   Electron 9.x - Node.js v12.14.1
-   Electron 10.x - Node.js v12.16.3
-   Electron 11.x - Node.js v12.18.3
-   Electron 12.x - Node.js v14.16.0
-   Electron 13.x - Node.js v14.16.0

#### 安装对应版本

那么我们重新安装对应版本的 `Electron`

```
npm install --save-dev electron@13.0.0
```

然后运行程序可以看到控制台打印

```
undefined ".NET Welcomes Electron"
```

至此我们成功使用 `electron-edge-js` 执行了一段 `C#` 代码

#### 调用 DLL

`html` 中添加按钮

```
<button id="testDll">testDll</button>
```

`preload` 监听按钮事件
```javascript
const edge = require('electron-edge-js');
const path = require('path')
```
```javascript
const testDll = document.getElementById('testDll')
testDll.onclick = function () {
  const Invoke = edge.func({
    assemblyFile: path.resolve(__dirname, "./dll/electronedge.dll"),
    typeName: "electronedge.MQ",
    methodName: "Invoke"
  })
  Invoke('Electron', (error, value) => {
    console.log(error, value)
  })
}
```

运行程序, 点击 `testDll`, 控制台成功打印信息
```
undefined "来自dll : 2021-11-27 21:56:58.392 Electron"
```

Add

npm install -g node-gyp
npm install --global windows-build-tools

        MyReader.FPReaderList += new FastCodeSDK.FPReader.FPReaderListEventHandler(MyReader_FPReaderList);
        
        void MyReader_FPReaderList(string VC)
        {
          Console.WriteLine("VC : " + VC);
        }

        void MyReader_FPEnrollmentStatus(FPReader.EnrollmentStatus Status)
        {
            Console.WriteLine("Enrollment Status : " + Convert.ToString(Status));
            if (Status == FPReader.EnrollmentStatus.Sucess || Status == FPReader.EnrollmentStatus.Fail)
            {
              Console.WriteLine("Enrollment Success");
            }
            if (Status == FPReader.EnrollmentStatus.Sucess &&  String.IsNullOrEmpty(Temp)) {
              Console.WriteLine("Enrollment Failed");
            }
        }
        MyReader.FPEnrollmentStatus += new FPReader.FPEnrollmentStatusEventHandler(MyReader_FPEnrollmentStatus);
        
        //MyReader.FPEnrollmentSingleSampleStart(TemplateSafetyKey);
