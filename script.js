// ===============================
// NOVA CORE Translator
// ===============================

// Elements
const fromLanguage = document.getElementById("fromLanguage");
const toLanguage = document.getElementById("toLanguage");

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const translateBtn = document.getElementById("translateBtn");
const swapBtn = document.getElementById("swapBtn");

const copyInput = document.getElementById("copyInput");
const copyOutput = document.getElementById("copyOutput");

const micBtn = document.getElementById("micBtn");
const speakBtn = document.getElementById("speakBtn");

const themeBtn = document.getElementById("themeBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");

// ===============================
// DARK MODE
// ===============================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.textContent="☀️ Light Mode";
    }else{
        themeBtn.textContent="🌙 Dark Mode";
    }

});

// ===============================
// SWAP
// ===============================

swapBtn.addEventListener("click",()=>{

    [fromLanguage.value,toLanguage.value]=
    [toLanguage.value,fromLanguage.value];

    [inputText.value,outputText.value]=
    [outputText.value,inputText.value];

});

// ===============================
// TRANSLATE
// ===============================

translateBtn.addEventListener("click",async()=>{

    const text=inputText.value.trim();

    if(text===""){
        alert("Enter text");
        return;
    }

    outputText.value="Translating...";

    try{

        const res=await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLanguage.value}|${toLanguage.value}`);

        const data=await res.json();

        outputText.value=data.responseData.translatedText;

    }catch(e){

        outputText.value="Translation failed.";

    }

});

// ===============================
// COPY
// ===============================

copyInput.addEventListener("click",()=>{

navigator.clipboard.writeText(inputText.value);

});

copyOutput.addEventListener("click",()=>{

navigator.clipboard.writeText(outputText.value);

});

// ===============================
// CLEAR
// ===============================

clearBtn.addEventListener("click",()=>{

inputText.value="";
outputText.value="";

});

// ===============================
// DOWNLOAD
// ===============================

downloadBtn.addEventListener("click",()=>{

if(outputText.value==="") return;

const blob=new Blob([outputText.value],{type:"text/plain"});

const a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="translation.txt";

a.click();

});

// ===============================
// SPEAK
// ===============================

speakBtn.addEventListener("click",()=>{

if(outputText.value==="") return;

speechSynthesis.cancel();

const speech=new SpeechSynthesisUtterance(outputText.value);

speech.lang=toLanguage.value;

speechSynthesis.speak(speech);

});

// ===============================
// VOICE INPUT
// ===============================

const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;

if(SpeechRecognition){

const recognition=new SpeechRecognition();

recognition.lang="en-US";

recognition.onresult=(e)=>{

inputText.value=e.results[0][0].transcript;

};

micBtn.addEventListener("click",()=>{

recognition.start();

});

}else{

micBtn.disabled=true;

}

// ===============================
// ENTER TO TRANSLATE
// ===============================

inputText.addEventListener("keydown",(e)=>{

if(e.key==="Enter"&&!e.shiftKey){

e.preventDefault();

translateBtn.click();

}

});
