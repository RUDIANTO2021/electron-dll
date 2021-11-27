

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
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
