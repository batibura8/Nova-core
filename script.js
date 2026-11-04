
// ==========================================
// 🌍 NOVA CORE AI TRANSLATOR
// ==========================================

console.log("🌍 Nova Core loading...");

// GET HTML ELEMENTS
const inputLang = document.getElementById("inputLang");
const outputLang = document.getElementById("outputLang");

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const translateBtn = document.getElementById("translateBtn");
const swapBtn = document.getElementById("swapBtn");
const copyBtn = document.getElementById("copyBtn");
const micBtn = document.getElementById("micBtn");
const speakBtn = document.getElementById("speakBtn");
const clearBtn = document.getElementById("clearBtn");
const status = document.getElementById("status");

// LANGUAGE CODES FOR VOICE
const voiceLanguages = {
    en: "en-US",
    om: "om-ET",
    am: "am-ET"
};

// ==========================================
// 🌍 TRANSLATION
// ==========================================

translateBtn.addEventListener("click", async function () {

    const text = inputText.value.trim();
    const from = inputLang.value;
    const to = outputLang.value;

    if (!text) {
        status.textContent = "Please enter text first.";
        return;
    }

    if (from === to) {
        status.textContent = "Choose two different languages.";
        return;
    }

    translateBtn.disabled = true;
    translateBtn.textContent = "⏳ Translating...";
    status.textContent = "Connecting to translation service...";

    try {

        const apiURL =
            "https://api.mymemory.translated.net/get?q=" +
            encodeURIComponent(text) +
            "&langpair=" +
            encodeURIComponent(from + "|" + to);

        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error("Translation server is unavailable.");
        }

        const data = await response.json();

        if (
            !data.responseData ||
            !data.responseData.translatedText
        ) {
            throw new Error("No translation was returned.");
        }

        if (
            data.responseStatus &&
            Number(data.responseStatus) !== 200
        ) {
            throw new Error(
                data.responseDetails || "Translation failed."
            );
        }

        outputText.value =
            data.responseData.translatedText;

        status.textContent = "✅ Translation completed!";

    } catch (error) {

        console.error("Translation error:", error);

        status.textContent =
            "❌ Translation failed. Check your internet and try again.";

    } finally {

        translateBtn.disabled = false;
        translateBtn.textContent = "✨ Translate Now";

    }

});

// ==========================================
// 🔄 SWAP LANGUAGES
// ==========================================

swapBtn.addEventListener("click", function () {

    const oldLanguage = inputLang.value;

    inputLang.value = outputLang.value;
    outputLang.value = oldLanguage;

    const oldText = inputText.value;

    inputText.value = outputText.value;
    outputText.value = oldText;

});

// ==========================================
// 📋 COPY TRANSLATION
// ==========================================

copyBtn.addEventListener("click", async function () {

    const text = outputText.value.trim();

    if (!text) {
        status.textContent = "Nothing to copy.";
        return;
    }

    try {

        await navigator.clipboard.writeText(text);

        copyBtn.textContent = "✅ Copied!";

        setTimeout(() => {
            copyBtn.textContent = "📋 Copy";
        }, 1500);

    } catch (error) {

        outputText.select();

        const copied = document.execCommand("copy");

        status.textContent = copied
            ? "✅ Copied!"
            : "Copy failed. Please copy manually.";

    }

});

// ==========================================
// 🗑️ CLEAR TEXT
// ==========================================

clearBtn.addEventListener("click", function () {

    inputText.value = "";
    outputText.value = "";
    status.textContent = "";

});

// ==========================================
// 🔊 TEXT TO SPEECH
// ==========================================

speakBtn.addEventListener("click", function () {

    const text = outputText.value.trim();

    if (!text) {
        status.textContent = "No translation to read.";
        return;
    }

    if (!window.speechSynthesis) {
        status.textContent = "Speech is not supported.";
        return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang =
        voiceLanguages[outputLang.value] || "en-US";

    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);

});

// ==========================================
// 🎤 VOICE INPUT
// ==========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function () {
        micBtn.textContent = "🔴 Listening...";
    };

    recognition.onresult = function (event) {

        const result = event.results[0][0].transcript;

        inputText.value +=
            (inputText.value ? " " : "") + result;

    };

    recognition.onerror = function (event) {

        console.error("Microphone error:", event.error);

        status.textContent =
            "Microphone error: " + event.error;

    };

    recognition.onend = function () {
        micBtn.textContent = "🎙️ Voice";
    };

    micBtn.addEventListener("click", function () {

        try {

            recognition.lang =
                voiceLanguages[inputLang.value] || "en-US";

            recognition.start();

        } catch (error) {

            status.textContent =
                "Microphone is already active.";

        }

    });

} else {

    micBtn.addEventListener("click", function () {

        status.textContent =
            "Voice input is not supported in this browser.";

    });

}

// ==========================================
// ⌨️ ENTER TO TRANSLATE
// ==========================================

inputText.addEventListener("keydown", function (event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();
        translateBtn.click();

    }

});

// ==========================================
// 🚀 READY
// ==========================================

console.log("✅ Nova Core is ready!");
status.textContent = "🌍 Nova Core is ready.";
