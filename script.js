const passages = [
    "The quick brown fox jumps over the lazy dog.",
    "Technology continues to change the way people learn, work, communicate, and solve everyday problems.",
    "Learning to type quickly and accurately takes consistent practice and patience.",
    "Programming is not about writing code quickly. It is about solving problems clearly and efficiently.",
    "Small improvements every day can lead to significant results over time."
];
function getRandomPassage() {
    const randomIndex = Math.floor(Math.random() * passages.length);

    return passages[randomIndex];
}
function loadNewPassage() {
    const newPassage = getRandomPassage();

    textElement.textContent = newPassage;

    displayText();

    updateCharacterHighlighting();

    updateProgress();
}
function initializeTest() {
    timeRemaining = 30;
    testStarted = false;
    testFinished = false;

    timerElement.textContent = "30";
    wpmElement.textContent = "0";
    accuracyElement.textContent = "100%";

    typingInput.value = "";
    typingInput.disabled = false;

    typingTest.style.display = "block";
    resultScreen.style.display = "none";

    loadNewPassage();

    updateCharacterHighlighting();
    updateProgress();
}
const typingContainer = document.querySelector(".typing-container");
const timerElement = document.getElementById("timer");
const textElement = document.getElementById("text-to-type");
const typingInput = document.getElementById("typing-input");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const restartButton = document.getElementById("restart-button");
const resultScreen = document.getElementById("result-screen");
const finalWpmElement = document.getElementById("final-wpm");
const finalAccuracyElement = document.getElementById("final-accuracy");
const tryAgainButton = document.getElementById("try-again-button");
const typingTest = document.getElementById("typing-test");
const progressFill = document.getElementById("progress-fill");
const progressCount = document.getElementById("progress-count");
const progressPercentage = document.getElementById("progress-percentage");

let timeRemaining = 30;

let timerInterval;

let testStarted = false;
let testFinished = false;

function startTimer() {
    timerInterval = setInterval(function () {
        timeRemaining--;
        timerElement.textContent = timeRemaining;
        const wpm = calculateWPM();

        wpmElement.textContent = Math.round(wpm);

        if (timeRemaining <= 0) {

            clearInterval(timerInterval);

            testFinished = true;

            typingInput.disabled = true;

            showResults();

        }
    }, 1000);
}
function calculateAccuracy() {

    const targetText = textElement.textContent.trim();

    const typedText = typingInput.value;

    if (typedText.length === 0) {
        return 100;
    }

    let correctCharacters = 0;

    for (let i = 0; i < typedText.length; i++) {

        if (typedText[i] === targetText[i]) {
            correctCharacters++;
        }

    }

    const accuracy = (correctCharacters / typedText.length) * 100;

    return accuracy;

}

function displayText() {

    const targetText = textElement.textContent.trim();

    let charactersHTML = "";

    for (let i = 0; i < targetText.length; i++) {

        charactersHTML += `<span>${targetText[i]}</span>`;

    }

    textElement.innerHTML = charactersHTML;
}

function updateCharacterHighlighting() {
    const targetText = textElement.textContent;
    const typedText = typingInput.value;

    const characterElements =
        textElement.querySelectorAll("span");

    characterElements.forEach(function (character) {
        character.classList.remove("correct");
        character.classList.remove("incorrect");
        character.classList.remove("current");
    });

    for (
        let i = 0;
        i < typedText.length && i < characterElements.length;
        i++
    ) {
        if (typedText[i] === targetText[i]) {
            characterElements[i].classList.add("correct");
        } else {
            characterElements[i].classList.add("incorrect");
        }
    }

    if (typedText.length < characterElements.length) {
        characterElements[typedText.length].classList.add("current");
    }
}

function calculateWPM() {
    const targetText = textElement.textContent;
    const typedText = typingInput.value;

    const elapsedTime = 30 - timeRemaining;

    if (elapsedTime <= 0) {
        return 0;
    }

    let correctCharacters = 0;

    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === targetText[i]) {
            correctCharacters++;
        }
    }

    const elapsedMinutes = elapsedTime / 60;

    const wpm = (correctCharacters / 5) / elapsedMinutes;

    return wpm;
}

function showResults() {

    const finalWpm = calculateWPM();

    const finalAccuracy = calculateAccuracy();

    finalWpmElement.textContent = Math.round(finalWpm);

    finalAccuracyElement.textContent =
        Math.round(finalAccuracy) + "%";
    typingTest.style.display = "none";
    resultScreen.style.display = "block";

}

function resetTest() {
    clearInterval(timerInterval);

    timeRemaining = 30;
    testStarted = false;
    testFinished = false;

    timerElement.textContent = "30";
    wpmElement.textContent = "0";
    accuracyElement.textContent = "100%";

    progressFill.style.width = "0%";
    progressCount.textContent = "0 / 0";
    progressPercentage.textContent = "0%";

    typingInput.value = "";
    typingInput.disabled = false;

    loadNewPassage();
    typingTest.style.display = "block";
    resultScreen.style.display = "none";

    typingInput.focus();
}

restartButton.addEventListener("click", function () {
    resetTest();
});

tryAgainButton.addEventListener("click", function () {
    resetTest();
});

typingInput.addEventListener("input", function () {
    if (testFinished) {
        return;
    }

    const targetText = textElement.textContent;

    // Prevent typing more characters than the passage
    if (typingInput.value.length > targetText.length) {
        typingInput.value = typingInput.value.slice(0, targetText.length);
    }

    if (!testStarted) {
        testStarted = true;
        startTimer();
    }

    updateCharacterHighlighting();

    updateProgress();

    const accuracy = calculateAccuracy();

    accuracyElement.textContent = Math.round(accuracy) + "%";

    // Check if the entire passage has been typed
    if (typingInput.value.length === targetText.length) {
        clearInterval(timerInterval);

        testFinished = true;

        typingInput.disabled = true;

        showResults();
    }
});

function updateProgress() {
    const targetText = textElement.textContent;
    const typedText = typingInput.value;

    const totalCharacters = targetText.length;
    const typedCharacters = typedText.length;

    const percentage =
        (typedCharacters / totalCharacters) * 100;

    progressFill.style.width = percentage + "%";

    progressCount.textContent =
        typedCharacters + " / " + totalCharacters;

    progressPercentage.textContent =
        Math.round(percentage) + "%";
}

function loadNewPassage() {
    const newPassage = getRandomPassage();

    textElement.textContent = newPassage;

    displayText();

    updateCharacterHighlighting();
}

textElement.addEventListener("click", function () {
    if (!testFinished) {
        typingInput.focus();
    }
});

function initializeTest() {
    timeRemaining = 30;
    testStarted = false;
    testFinished = false;

    timerElement.textContent = "30";
    wpmElement.textContent = "0";
    accuracyElement.textContent = "100%";

    typingInput.value = "";
    typingInput.disabled = false;

    typingTest.style.display = "block";
    resultScreen.style.display = "none";

    loadNewPassage();

    updateCharacterHighlighting();
    updateProgress();
}

initializeTest();