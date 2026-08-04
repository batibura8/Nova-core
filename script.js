// ===============================
// LINGO BATI v2.0
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

// ===============================
// 🌙 DARK MODE
// ===============================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeBtn.textContent = "☀️ Light Mode";

    } else {

        themeBtn.textContent = "🌙 Dark Mode";

    }

});

// ===============================
// 🔄 SWAP LANGUAGES
// ===============================

swapBtn.addEventListener("click", () => {

    const tempLang = fromLanguage.value;
    fromLanguage.value = toLanguage.value;
    toLanguage.value = tempLang;

    const tempText = inputText.value;
    inputText.value = outputText.value;
    outputText.value = tempText;

});


// ===============================
// 📋 COPY INPUT
// ===============================

copyInput.addEventListener("click", () => {

    if (inputText.value.trim() === "") {
        alert("Nothing to copy.");
        return;
    }

    navigator.clipboard.writeText(inputText.value);
    alert("✅ Input copied!");

});

// ===============================
// 📋 COPY OUTPUT
// ===============================

copyOutput.addEventListener("click", () => {

    if (outputText.value.trim() === "") {
        alert("Nothing to copy.");
        return;
    }

    navigator.clipboard.writeText(outputText.value);
    alert("✅ Translation copied!");

});

// ===============================
// 🔊 TEXT TO SPEECH
// ===============================

speakBtn.addEventListener("click", () => {

    if (outputText.value.trim() === "") {
        alert("Nothing to read.");
        return;
    }

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(outputText.value);

    switch (toLanguage.value) {

        case "en":
            speech.lang = "en-US";
            break;

        case "am":
            speech.lang = "am-ET";
            break;

        case "fr":
            speech.lang = "fr-FR";
            break;

        case "es":
            speech.lang = "es-ES";
            break;

        case "de":
            speech.lang = "de-DE";
            break;

        case "ar":
            speech.lang = "ar-SA";
            break;

        default:
            speech.lang = "en-US";

    }

    speech.rate = 1;
    speech.pitch = 1;

    speechSynthesis.speak(speech);

});
// ===============================
// 🌍 TRANSLATE
// ===============================

translateBtn.addEventListener("click", async () => {

    const text = inputText.value.trim();

    if (text === "") {
        alert("Please enter text to translate.");
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

        console.error(error);

        outputText.value =
            "Internet connection error.";

    }

});


// ===============================
// 🎤 VOICE INPUT
// ===============================

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    micBtn.addEventListener("click", () => {

        recognition.start();

    });

    recognition.onresult = (event) => {

        inputText.value =
        event.results[0][0].transcript;

    };

    recognition.onerror = (event) => {

        alert("Voice Error : " + event.error);

    };

} else {

    micBtn.disabled = true;

    micBtn.textContent =
    "Speech Not Supported";

}
// ===============================
// 💾 TRANSLATION HISTORY
// ===============================

let history = [];

function saveHistory(input, output) {

    history.unshift({
        input: input,
        output: output,
        time: new Date().toLocaleString()
    });

    if (history.length > 10) {
        history.pop();
    }

    localStorage.setItem(
        "lingoHistory",
        JSON.stringify(history)
    );

}

// Save after translation
translateBtn.addEventListener("click", () => {

    setTimeout(() => {

        if (
            outputText.value &&
            outputText.value !== "Translating..." &&
            outputText.value !== "Translation failed."
        ) {

            saveHistory(
                inputText.value,
                outputText.value
            );

        }

    }, 1500);

});

// ===============================
// ⌨️ PRESS ENTER TO TRANSLATE
// ===============================

inputText.addEventListener("keydown", (event) => {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        translateBtn.click();

    }
// ===============================
// 📥 DOWNLOAD TRANSLATION
// ===============================

const downloadBtn =
document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", () => {

    if (outputText.value.trim() === "") {

        alert("Nothing to download.");

        return;

    }

    const file = new Blob(
        [outputText.value],
        { type: "text/plain" }
    );

    const link =
    document.createElement("a");

    link.href = URL.createObjectURL(file);

    link.download = "translation.txt";

    link.click();

});

// ===============================
// 🗑️ CLEAR
// ===============================

const clearBtn =
document.getElementById("clearBtn");

clearBtn.addEventListener("click", () => {

    inputText.value = "";

    outputText.value = "";

});

// ===============================
// ⭐ FAVORITE
// ===============================

let favorites = JSON.parse(
localStorage.getItem("favorites")
) || [];

function addFavorite(){

    favorites.push({

        input: inputText.value,

        output: outputText.value

    });

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    alert("⭐ Saved!");

}
});

