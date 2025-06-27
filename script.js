let lowerLimit, upperLimit, timeLimit;
let currentQuestion = {};
let timer;
let timeLeft;
let correctAnswers = [];
let wrongAnswers = [];

function startGame() {
    lowerLimit = parseInt(document.getElementById("lowerLimit").value);
    upperLimit = parseInt(document.getElementById("upperLimit").value);
    timeLimit = parseInt(document.getElementById("timeLimit").value);

    if (isNaN(lowerLimit) || isNaN(upperLimit) || isNaN(timeLimit) || lowerLimit > upperLimit) {
        alert("⚠️ Please enter valid number ranges and time limit.");
        return;
    }

    correctAnswers = [];
    wrongAnswers = [];

    document.getElementById("questionBox").classList.remove("hidden");
    document.getElementById("scoreBox").classList.add("hidden");
    document.getElementById("resultsList").classList.add("hidden");
    askNewQuestion();
}

function askNewQuestion() {
    const a = getRandomInt(1, 10); // Fixed: always 1–10
    const b = getRandomInt(lowerLimit, upperLimit); // Custom range from user input
    currentQuestion = { a, b, correct: a * b };

    document.getElementById("questionText").textContent = `❓ What is ${a} × ${b}?`;
    document.getElementById("answerInput").value = "";
    document.getElementById("answerInput").focus();

    timeLeft = timeLimit;
    document.getElementById("timeDisplay").textContent = timeLeft;

    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timeDisplay").textContent = timeLeft;
        if (timeLeft <= 0) {
            submitAnswer(); // auto-submit on timeout
        }
    }, 1000);
}

document.getElementById("answerInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        submitAnswer();
    }
});

function submitAnswer() {
    clearInterval(timer);
    const userAnswer = parseInt(document.getElementById("answerInput").value);
    const { a, b, correct } = currentQuestion;

    if (userAnswer === correct) {
        correctAnswers.push({ a, b, userAnswer });
    } else {
        wrongAnswers.push({ a, b, userAnswer: isNaN(userAnswer) ? "No answer" : userAnswer });
    }
    askNewQuestion();
}

function stopGame() {
    clearInterval(timer);
    document.getElementById("questionBox").classList.add("hidden");
    document.getElementById("scoreBox").classList.remove("hidden");

    document.getElementById("correctCount").textContent = correctAnswers.length;
    document.getElementById("wrongCount").textContent = wrongAnswers.length;
}

function showResults() {
    const results = [...correctAnswers.map(r => ({
        ...r,
        result: "✅ Correct"
    })), ...wrongAnswers.map(r => ({
        ...r,
        result: `❌ Wrong (Ans: ${r.a * r.b})`
    }))];

    const resultsList = document.getElementById("resultsList");
    resultsList.innerHTML = results.map(r =>
        `<p>${r.a} × ${r.b} = ${r.userAnswer} → ${r.result}</p>`
    ).join("");
    resultsList.classList.remove("hidden");
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
