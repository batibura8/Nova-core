const fromLanguage = document.getElementById("fromLanguage");
const toLanguage = document.getElementById("toLanguage");
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const translateBtn = document.getElementById("translateBtn");
const swapBtn = document.getElementById("swapBtn");
const copyInput = document.getElementById("copyInput");
const copyOutput = document.getElementById("copyOutput");
const micBtn = document.getElementById("micBtn");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    micBtn.addEventListener("click", function () {
        recognition.start();
    });

    recognition.onresult = function (event) {
        inputText.value = event.results[0][0].transcript;
    };

    recognition.onerror = function () {
        alert("Microphone hin hojjenne ykn hayyamni hin kennamne.");
    };
} else {
    micBtn.disabled = true;
    micBtn.textContent = "Speech not supported";
}
// TRANSLATE
translateBtn.addEventListener("click", async function () {
    const text = inputText.value.trim();

    if (text === "") {
        alert("Please enter text to translate.");
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

        if (
            data.responseData &&
            data.responseData.translatedText
        ) {
            outputText.value = data.responseData.translatedText;
        } else {
            outputText.value = "Translation failed.";
        }
    } catch (error) {
        console.error(error);
        outputText.value =
            "Internet connection or translation error.";
    }
});

// SWAP LANGUAGES
swapBtn.addEventListener("click", function () {
    const oldFrom = fromLanguage.value;

    fromLanguage.value = toLanguage.value;
    toLanguage.value = oldFrom;

    const oldText = inputText.value;
    inputText.value = outputText.value;
    outputText.value = oldText;
});

// COPY INPUT
copyInput.addEventListener("click", function () {
    if (inputText.value.trim() === "") {
        alert("Nothing to copy.");
        return;
    }

    navigator.clipboard.writeText(inputText.value);
    alert("Copied! ✅");
});

// COPY OUTPUT
copyOutput.addEventListener("click", function () {
    if (outputText.value.trim() === "") {
        alert("Nothing to copy.");
        return;
    }

    navigator.clipboard.writeText(outputText.value);
    alert("Copied! ✅");
});
