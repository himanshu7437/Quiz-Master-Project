// Variables
const questions = [
    // Existing Questions
    {
        question: "What does HTML stand for?",
        hint: "It’s used to create the structure of web pages.",
        answers: [
            { text: "Hyper Text Markup Language", correct: true },
            { text: "Hyper Transfer Markup Language", correct: false },
            { text: "Home Text Markup Language", correct: false },
            { text: "Hyperlink Text Markup Language", correct: false }
        ]
    },
    {
        question: "Which tag is used to create a paragraph in HTML?",
        hint: "It’s a tag that starts with 'p'.",
        answers: [
            { text: "<p>", correct: true },
            { text: "<div>", correct: false },
            { text: "<span>", correct: false },
            { text: "<h1>", correct: false }
        ]
    },
    {
        question: "Which HTML tag is used to display an image?",
        hint: "This tag has a 'src' attribute.",
        answers: [
            { text: "<img>", correct: true },
            { text: "<image>", correct: false },
            { text: "<picture>", correct: false },
            { text: "<media>", correct: false }
        ]
    },
    {
        question: "Which tag is used to create a link in HTML?",
        hint: "This tag starts with 'a'.",
        answers: [
            { text: "<link>", correct: false },
            { text: "<a>", correct: true },
            { text: "<href>", correct: false },
            { text: "<url>", correct: false }
        ]
    },
    {
        question: "What attribute is used to specify the destination of a link?",
        hint: "It’s part of the <a> tag.",
        answers: [
            { text: "href", correct: true },
            { text: "src", correct: false },
            { text: "alt", correct: false },
            { text: "target", correct: false }
        ]
    },
    // New HTML Questions
    {
        question: "Which tag is used for the largest header in HTML?",
        hint: "It’s a tag used to define headings.",
        answers: [
            { text: "<h1>", correct: true },
            { text: "<h2>", correct: false },
            { text: "<header>", correct: false },
            { text: "<head>", correct: false }
        ]
    },
    {
        question: "Which tag is used to create an ordered list in HTML?",
        hint: "Think about numbering the items.",
        answers: [
            { text: "<ol>", correct: true },
            { text: "<ul>", correct: false },
            { text: "<li>", correct: false },
            { text: "<list>", correct: false }
        ]
    },
    {
        question: "Which tag is used to create a form in HTML?",
        hint: "This tag surrounds user input fields.",
        answers: [
            { text: "<input>", correct: false },
            { text: "<form>", correct: true },
            { text: "<button>", correct: false },
            { text: "<fieldset>", correct: false }
        ]
    },
    {
        question: "What is the correct HTML tag for inserting a line break?",
        hint: "This tag doesn't require a closing tag.",
        answers: [
            { text: "<br>", correct: true },
            { text: "<break>", correct: false },
            { text: "<hr>", correct: false },
            { text: "<line>", correct: false }
        ]
    },
    {
        question: "Which attribute specifies an alternative text for an image, if the image cannot be displayed?",
        hint: "It’s used with the <img> tag.",
        answers: [
            { text: "alt", correct: true },
            { text: "src", correct: false },
            { text: "title", correct: false },
            { text: "url", correct: false }
        ]
    }
];


const nameForm = document.getElementById('start-form');
const nameInput = document.getElementById('name-input');
const quizContainer = document.getElementById('quiz-container');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const hintElement = document.getElementById('hint-text');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const resultsContainer = document.getElementById('results-container');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');
const progressBar = document.getElementById('progress');
const leaderboardElement = document.getElementById('leaderboard');
const timerElement = document.getElementById('time-left');

let currentQuestionIndex = 0;
let score = 0;
let timer;
const timeLimit = 30; // Time limit in seconds
let userName = '';

// Event Listeners
nameForm.addEventListener('submit', startQuiz);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        setNextQuestion();
    } else {
        showResults();
    }
});
restartButton.addEventListener('click', restartQuiz);

// Functions
function startQuiz(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    userName = nameInput.value.trim();
    if (userName === '') {
        alert('Please enter your name to start the quiz.');
        return;
    }

    // Hide the name form and show the quiz container
    nameForm.classList.add('hidden');
    quizContainer.classList.remove('hidden');

    score = 0;
    currentQuestionIndex = 0;
    resultsContainer.classList.add('hidden');
    questionContainerElement.classList.remove('hidden');
    setNextQuestion();
    updateProgressBar();
}

function setNextQuestion() {
    resetState();
    showQuestion(questions[currentQuestionIndex]);
    updateProgressBar();
    startTimer();
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    hintElement.innerText = question.hint;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hidden');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
    clearInterval(timer);
    timerElement.textContent = timeLimit;
    timerElement.parentElement.classList.remove('red'); // Ensure timer color is reset
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    if (correct) {
        score++;
        selectedButton.classList.add('correct');
    } else {
        selectedButton.classList.add('wrong');
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === 'true') {
            button.classList.add('correct');
        }
        button.disabled = true;
    });
    nextButton.classList.remove('hidden');
    clearInterval(timer); // Stop the timer when an answer is selected
}

function showResults() {
    quizContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    scoreElement.innerText = `${userName}, you scored ${score} out of ${questions.length}`;
    updateLeaderboard();
}

function updateLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name: userName, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    renderLeaderboard(leaderboard);
}

function renderLeaderboard(leaderboard) {
    leaderboardElement.innerHTML = '';
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.name}: ${entry.score}`;
        leaderboardElement.appendChild(li);
    });
}

function startTimer() {
    let timeLeft = timeLimit;
    timerElement.textContent = timeLeft;
    timerElement.parentElement.classList.remove('red'); // Ensure timer color is reset
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 10) {
            timerElement.parentElement.classList.add('red');
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeUp();
        }
    }, 1000);
}

function handleTimeUp() {
    alert('Time is up! Submitting the quiz.');
    selectAnswer({ target: null }); // Simulate answer selection to end quiz
}

function updateProgressBar() {
    const progress = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function restartQuiz() {
    resultsContainer.classList.add('hidden');
    nameForm.classList.remove('hidden');
    quizContainer.classList.add('hidden');
    nameInput.value = ''; // Clear the name input field
    progressBar.style.width = '0%'; // Reset the progress bar
}
