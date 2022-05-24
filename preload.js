

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
    alert('btn');
    const helloWorld = edge.func(function () {
    async (input) => {
        return ".NET Welcomes " + input.ToString();
    }
    });
    helloWorld('Electron', (error, value) => {
      console.log(error, value)
    })
  }

  const testDll = document.getElementById('testDll')
  testDll.onclick = function () {
    alert('Masuk');
    const Invoke = edge.func({
      assemblyFile: path.resolve(__dirname, "./dll/FastCodeSDK.dll"),
      typeName: "electronedge.MQ",
      methodName: "Invoke"
    })
    console.log(Invoke);
    Invoke('Electron', (error, value) => {
      //alert('a')
      if (error) {
        //console.log(error);
        throw error; 
      } else {  
        console.log(value);
      }
    })
  }
}

//const ffi = require("@saleae/ffi");