const { exec } = require('child_process');
const path = require('path');
const express = require('express');
const fs = require('fs');

const { app, BrowserWindow } = require('electron');
var win;
var DownloadsDir = path.join("C:\\tenp", 'Downloads');
console.log(DownloadsDir);
if(!fs.existsSync(DownloadsDir))fs.mkdirSync(DownloadsDir,{recursive:true});
  
function createWindow() {
  win = new BrowserWindow({
    width: 500,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  win.loadFile('index.html');
}

function sendCustonMensage(custonMensage) {
  win.webContents.send('CustonMensage', custonMensage);
}

const web_app = express()
const port = 3000;

web_app.post("/upFile", (req, res) => {
  let FileName = req.headers.file_name;
  let FileSize = Number(req.headers.file_size);

  win.webContents.send('addStage', { StageName: "Download" });

  let fileDir = DownloadsDir+"\\"+FileName;
  let file = fs.createWriteStream(fileDir);

  var count = 0;
  var size_some = 0;
  var media_count = 1;
  var last_time = new Date().getTime();
  var velocity = 0;
  var velocity_some = 0;

  req.on('data', chunk => {
    size_some += chunk.length;
    let progress = size_some / FileSize * 100;

    count++;
    media_count++;
    let elapsed_time = new Date().getTime() - last_time;
    if (elapsed_time == 0) elapsed_time = 0.1;
    last_time = new Date().getTime();

    velocity = (chunk.length / 1000000) / (elapsed_time / 1000);
    velocity_some += velocity;
    let velocity_media = velocity_some / media_count;


    sendCustonMensage(`<p> velocity: ${velocity.toFixed(3)}Mbps </p>` +
    `<p> media: ${velocity_media.toFixed(3)}Mbps </p>`)

    file.write(chunk);

    if (media_count === 500) {
      media_count = 1;
      velocity_some = velocity;
    }

    win.webContents.send('updateStageStatus', {
      StageName: "Download",
      Progress: progress.toFixed(3).toString(),
      StatusResult: "0" //ResultWanting
    });
  })

  req.on('end', async () => {
    win.webContents.send('updateStageStatus', {
      StageName: "Download",
      Progress: "100",
      StatusResult: "2" //ResultWanting
    });

    file.end();
    file = null;
    console.log("dawnload complet FileSize: " + size_some);
    res.status(200).send("upload sucefull");

    exec(fileDir);
  })
});

web_app.post("/addStage", (req, res) => {
  win.webContents.send('addStage', { StageName: req.headers.stage_name });
  res.status(200).send("addStage sucefull");
});

web_app.post("/resetAllStages", (req, res) => {
  win.webContents.send('resetStages');
  res.status(200).send("resetStages sucefull");
});

web_app.post("/updateStageStatus", (req, res) => {
  win.webContents.send('updateStageStatus', {
    StageName: req.headers.stage_name,
    Progress: req.headers.progress,
    StatusResult: req.headers.status_result
  });
  res.status(200).send("updateStageStatus sucefull");
});

web_app.get("/", (req, res) => {
  res.send("Server is Online");  
})

try {
  web_app.listen(port, () => {
  console.log(`server started on http://localhost:${port}`)
})
} catch (error) {
  app.quit()
}

app.whenReady().then(() => {
  createWindow();
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
})