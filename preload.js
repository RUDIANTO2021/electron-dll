

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

  const testDll = document.getElementById('getReader')
  getReader.onclick = function () {
    var GetReaders = edge.func(function () {/*
      using System;
      using System.Collections.Generic;
      using System.ComponentModel;
      using FastCodeSDK;

      #r "dll/FastCodeSDK.dll"

      async (data) =>
      {
        
        FastCodeSDK.FPReader MyReader;
        int UserID = 100;
        string TemplateSafetyKey = "12345678";
        string Temp = "";
        
        MyReader = new FastCodeSDK.FPReader();
        
        MyReader.GetReaders();
        MyReader.SelectReader("5968-3873-0EF2-C868", "D400B01062", "CDC2-A08C-B136-8382-D412-0AD5-9603-B40E", FPReader.ReaderPriority.Low);
        MyReader.FPEnrollmentSingleSampleStart(TemplateSafetyKey);

        return MyReader;
      }

    */});

    var data = {};

    GetReaders(data, function (error, result) {
      if (error) throw error;
      console.log(result);
    });
    
  }  

}

