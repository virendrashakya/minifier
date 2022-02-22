const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById("fileSelecter").onclick = function() {myFunction()};

  function myFunction() {
    // document.getElementById("demo").innerHTML = "YOU CLICKED ME!";
    console.log('Hello')
    ipcRenderer.send('openFileSelectorDialog');
  }
})
