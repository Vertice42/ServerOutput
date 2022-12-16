const { ipcRenderer } = require('electron')

const ResultWanting = "0";
const ResultSuccessful = "2";
const ResultError = "3";

var ViewVideo = document.getElementById("VideoDivID");
var closeButton = document.getElementById("closeButtonID");
closeButton.onclick = () => {
  ViewVideo.style.display = "none";
}

function createViewStatusName(name){
 var StageStatus = document.createElement("div");
 StageStatus.classList.add("StageName");
 var text = document.createElement("span");
 text.innerText = name;
 StageStatus.appendChild(text);

 return StageStatus;
}

function createStageStatus(ID){
    var StageStatus = document.createElement("div");
    StageStatus.classList.add("StatusResultDiv");
    var text = document.createElement("span");
    text.classList.add("StatusResult");

    text.id = ID;
    text.style.backgroundColor = "#afeefd";

    StageStatus.appendChild(text);
   
    return StageStatus;
   }

function createViewProgressBar(ProgressBarID, TextID){
    var ProgressBarDiv = document.createElement("div");
    ProgressBarDiv.classList.add("ProgressBarDiv");
    
    var ProgressBar = document.createElement("div");
    ProgressBar.classList.add("ProgressBar");
    ProgressBar.style.width = "0%";
    ProgressBar.id = ProgressBarID;

    var text = document.createElement("span");
    text.id = TextID;
    text.innerText = "0%";

    ProgressBar.appendChild(text);
    ProgressBarDiv.appendChild(ProgressBar);
   
    return ProgressBarDiv;
   }

function createViewStage(newStage){
 var MainDiv = document.getElementById("MainDiv");
 var StageState = document.createElement("div");
 StageState.classList.add("StageState");

 StageState.appendChild(createViewStatusName(newStage.StageName));
 StageState.appendChild(createViewProgressBar("progressBar:"+newStage.StageName,"progressText:"+newStage.StageName));
 StageState.appendChild(createStageStatus("statusResult:"+newStage.StageName));

 MainDiv.appendChild(StageState);
}

function update(newStageStatus){
    var progressText = document.getElementById("progressText:"+newStageStatus.StageName);
    progressText.innerText = newStageStatus.Progress+'%';
    var progressBar = document.getElementById("progressBar:"+newStageStatus.StageName);
    progressBar.style.width = newStageStatus.Progress+'%';

    var ViewStatusResult = document.getElementById("statusResult:"+newStageStatus.StageName);

    switch (newStageStatus.StatusResult) {
        case(ResultSuccessful):
            ViewStatusResult.style.backgroundColor = "rgb(200 255 112)";
        break;
        case(ResultError): 
            ViewStatusResult.style.backgroundColor = "#b62828";
        break;
    }
}

ipcRenderer.on('addStage', (event, newStage) => {
 createViewStage(newStage);
})


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

/*
for (let i = 0; i < 10; i++) {
    createViewStage({StageName: "TEST"+i});
    update({StageName: "TEST"+i, Progress: getRandomIntInclusive(0,100)});
}*/

ipcRenderer.on('updateStageStatus', (event, newStageStatus) => {
    update(newStageStatus);
})

ipcRenderer.on('resetStages', (event) => {
    var MainDiv = document.getElementById("MainDiv");
    MainDiv.innerHTML = "";
})

ipcRenderer.on('CustonMensage', (event, CustonMensage) => {
    var InfoText = document.getElementById("InfoText");
    InfoText.innerHTML = CustonMensage;
})

ipcRenderer.on('openVideo', (event) => {
    var VideoDiv = document.getElementById("VideoDivID");
    VideoDiv.style.display = "";
})