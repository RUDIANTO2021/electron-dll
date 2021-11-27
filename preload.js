

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
const edge = require('electron-edge-js');
const path = require('path')
window.onload = function () {
  const btn = document.getElementById('btn')
  btn.onclick = function () {
    const helloWorld = edge.func(function () {/*
    async (input) => {
        return ".NET Welcomes " + input.ToString();
    }
*/});
    helloWorld('Electron', (error, value) => {
      console.log(error, value)
    })
  }

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
}
