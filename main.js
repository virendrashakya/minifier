const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { dialog } = require('electron');

var fs = require('fs');

const postcss = require('postcss')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 300,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.on('openFileSelectorDialog', (event, title) => {
    showFileSelectionDialog();
  })

  win.loadFile('index.html')
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


// logic to show dialogue for file selection
let showFileSelectionDialog = () => {
  dialog.showOpenDialog(
    {
      properties: ['openFile', 'multiSelections'],
        filters: [
          { name: 'All Files', extensions: ['css'] }
        ]
    }
  ).then(result => {
    if (result.canceled) {
      console.log('cancel kyun kar diya be !')
    } else if (Array.isArray(result.filePaths)) {
      console.log('Lo bhaiya ab multiple file ko edit karna padega')
      result.filePaths.forEach((filepath) => {
        readCssFileContent(filepath);
      })
    } else {
      console('chalo ek hi file ha edit karne ke liye ab')
    }
  }).catch(err => {
    console.log(err);
  });  
}
// logic to save converted files
let showSaveFileDialog = () => {
  dialog.showSaveDialogSync({

  })
}

// show messages
let showMessageDialog = () => {
  dialog.showMessageBoxSync({

  })
}

const minifyCss = async (cssFileContent) => {
  // We pass in an array of the plugins we want to use: `cssnano` and `autoprefixer`
  const output = await postcss([cssnano, autoprefixer])
    .process(cssFileContent)

  // The `css` property of `output` is the minified CSS as a string
  const minifiedCss = output.css
  return minifiedCss
}

const readCssFileContent = async (filepath) => {
  const unMinifiedFileContent = fs.readFileSync(filepath,
            {encoding:'utf8', flag:'r'});
  console.log(unMinifiedFileContent);
  const minifiedFileContent = await minifyCss(unMinifiedFileContent);
  console.log(minifiedFileContent);
  const miniFiedFilepath = await calculateMinifiedFilePath(filepath)
  writeMinifiedCssFile(miniFiedFilepath, minifiedFileContent)
}

const writeMinifiedCssFile = async (miniFiedFilepath, minifiedFileContent) => {
  fs.writeFileSync(miniFiedFilepath, minifiedFileContent)
}

const calculateMinifiedFilePath = async (unMinifiedFilePath) => {
  let positionOfExtension = unMinifiedFilePath.lastIndexOf(".");
  minifiedFileName = unMinifiedFilePath.substr(0, positionOfExtension < 0 ? unMinifiedFilePath.length : positionOfExtension) + ".min.css";
  return minifiedFileName
}