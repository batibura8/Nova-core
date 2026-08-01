const fromLanguage = document.getElementById("fromLanguage");
const toLanguage = document.getElementById("toLanguage");
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const translateBtn = document.getElementById("translateBtn");
const swapBtn = document.getElementById("swapBtn");
const copyInput = document.getElementById("copyInput");
const copyOutput = document.getElementById("copyOutput");
const micBtn = document.getElementById("micBtn");
const themeBtn = document.getElementById("themeBtn");

// =======================
// VOICE INPUT
// =======================

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    let isListening = false;

    micBtn.addEventListener("click", function () {

        if (!isListening) {
            recognition.start();
        }

    });

    recognition.onstart = function () {
        isListening = true;
        micBtn.textContent = "🎙️ Listening...";
    };

    recognition.onresult = function (event) {
        inputText.value = event.results[0][0].transcript;
    };

    recognition.onend = function () {
        isListening = false;
        micBtn.textContent = "🎤 Speak";
    };

    recognition.onerror = function (event) {
        isListening = false;
        micBtn.textContent = "🎤 Speak";
        alert("Voice Error: " + event.error);
    };

} else {

    micBtn.disabled = true;
    micBtn.textContent = "Speech Not Supported";

}

// =======================
// TRANSLATE
// =======================

translateBtn.addEventListener("click", async function () {

    const text = inputText.value.trim();

    if (text === "") {
        alert("Please enter text.");
        return;
    }

    if (fromLanguage.value === toLanguage.value) {
        outputText.value = text;
        return;
    }

    outputText.value = "Translating...";

    try {

        const url =
            "https://api.mymemory.translated.net/get?q=" +
            encodeURIComponent(text) +
            "&langpair=" +
            fromLanguage.value +
            "|" +
            toLanguage.value;

        const response = await fetch(url);

        const data = await response.json();

        if (data.responseData) {

            outputText.value =
                data.responseData.translatedText;

        } else {

            outputText.value =
                "Translation failed.";

        }

    } catch (error) {

        outputText.value =
            "Translation Error.";

    }

});

// =======================
// SWAP

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "☀️ Light Mode";
    } else {
        themeBtn.textContent = "🌙 Dark Mode";
    }
});
