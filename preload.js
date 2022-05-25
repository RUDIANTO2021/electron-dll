

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
//const MyReader = edge.func('./dll/FastCodeSDK.dll');
    
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
    /*const Invoke = edge.func({
      assemblyFile: path.resolve(__dirname, "./dll/electronedge.dll"),
      typeName: "electronedge.MQ",
      methodName: "Invoke"
    })*/
    
    const Invoke = edge.func({
      assemblyFile: path.resolve(__dirname, "./dll/FastCodeSDK.dll"),
      typeName: "FastCodeSDK.FPReader",
      methodName: "SelectReader"
    })

    console.log(Invoke);
    
    var PARAM = ["5968-3873-0EF2-C868", "D400B01062", "CDC2-A08C-B136-8382-D412-0AD5-9603-B40E", 0];
    /*
    Invoke(PARAM, (error, value) => {
      if (error) throw error;
      console.log(error, value)
    })
    */
    Invoke(PARAM, function (error, result) {
      if (error) throw error;
      console.log(result)
    })
    
    //var receiveHandler = Invoke(sendImpl, true); 

    /*var PARAM = ["5968-3873-0EF2-C868", "D400B01062", "CDC2-A08C-B136-8382-D412-0AD5-9603-B40E", 0];
    //var PARAM = ["SelectReader", "5968-3873-0EF2-C868", "D400B01062", "CDC2-A08C-B136-8382-D412-0AD5-9603-B40E", 0];
    //SelectReader("5968-3873-0EF2-C868", "D400B01062", "CDC2-A08C-B136-8382-D412-0AD5-9603-B40E", 0)

    Invoke(Invoke.SelectReader("5968-3873-0EF2-C868", "D400B01062", "CDC2-A08C-B136-8382-D412-0AD5-9603-B40E", 0), (error, value) => {
      if (error) throw error;
      console.log(error, value)
    })
    */

    //var receiveHandler = MyReader("GetReaders"); 
    //console.log(receiveHandler);
  }
}

