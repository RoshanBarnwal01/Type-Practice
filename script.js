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
const historySection = document.getElementById("history-section");
const historyList = document.getElementById("history-list");
const bestWpmElement = document.getElementById("best-wpm");
const averageWpmElement = document.getElementById("average-wpm");
const bestAccuracyElement = document.getElementById("best-accuracy");
const totalTestsElement = document.getElementById("total-tests");
const historyButton = document.getElementById("history-button");

let timeRemaining = 30;

let timerInterval;

let testStarted = false;
let testFinished = false;

function startTimer() {
    timerInterval = setInterval(function () {
        timeRemaining--;
        timerElement.textContent = timeRemaining;

                timerElement.classList.remove(
            "timer-warning",
            "timer-danger"
        );

        if (timeRemaining <= 5) {
            timerElement.classList.add("timer-danger");
        } else if (timeRemaining <= 10) {
            timerElement.classList.add("timer-warning");
        }

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

    saveResult();

    finalWpmElement.textContent = Math.round(finalWpm);

    finalAccuracyElement.textContent =
        Math.round(finalAccuracy) + "%";
    typingTest.style.display = "none";
    resultScreen.style.display = "block";

}

function saveResult() {
    const finalWpm = Math.round(calculateWPM());
    const finalAccuracy = Math.round(calculateAccuracy());

    const result = {
        wpm: finalWpm,
        accuracy: finalAccuracy,
        date: new Date().toLocaleString()
    };

    const history = JSON.parse(
        localStorage.getItem("typingHistory")
    ) || [];

    history.push(result);

    localStorage.setItem(
        "typingHistory",
        JSON.stringify(history)
    );
    displayHistory();
    updateStatistics();
}

function displayHistory() {
    const history = JSON.parse(
        localStorage.getItem("typingHistory")
    ) || [];

    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.innerHTML =
            '<p class="no-history">No typing tests completed yet.</p>';

        return;
    }

    const recentHistory = history.slice(-5).reverse();

    recentHistory.forEach(function (result) {
        const historyItem = document.createElement("div");

        historyItem.classList.add("history-item");

        historyItem.innerHTML = `
            <div class="history-info">

                <div>
                    <span class="history-label">WPM</span>
                    <span class="history-value">${result.wpm}</span>
                </div>

                <div>
                    <span class="history-label">Accuracy</span>
                    <span class="history-value">${result.accuracy}%</span>
                </div>

            </div>

            <span class="history-date">${result.date}</span>
        `;

        historyList.appendChild(historyItem);
    });

    historySection.style.display = "block";
}
function updateStatistics() {
    const history = JSON.parse(
        localStorage.getItem("typingHistory")
    ) || [];

    if (history.length === 0) {
        return;
    }

    const bestWpm = Math.max(
        ...history.map(function (result) {
            return result.wpm;
        })
    );

    const totalWpm = history.reduce(
        function (sum, result) {
            return sum + result.wpm;
        },
        0
    );

    const averageWpm = totalWpm / history.length;

    const bestAccuracy = Math.max(
        ...history.map(function (result) {
            return result.accuracy;
        })
    );

    bestWpmElement.textContent = bestWpm;
    averageWpmElement.textContent = Math.round(averageWpm);
    bestAccuracyElement.textContent = bestAccuracy + "%";
    totalTestsElement.textContent = history.length;
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

historyButton.addEventListener("click", function () {
    historySection.style.display = "block";

    displayHistory();
    updateStatistics();

    historySection.scrollIntoView({
        behavior: "smooth"
    });
});
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