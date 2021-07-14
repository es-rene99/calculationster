// TODO should organize the randomOperations code into it's own module, class or object.

function getRandomDigit() {
  return Math.floor(Math.random() * 10);
}

// create random operators

function getRandomOperator() {
  const operators = ['+', '-', '*', '/'];
  const randomOperator = operators[Math.floor(Math.random() * operators.length)];
  return randomOperator;
}

// tracker for ammount of correct answers

let correctResult;

// basic math operands

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

function getCorrectResult(mathOne, mathTwo, operatorValue) {
  switch (operatorValue) {
    case '*':
      return multiply(mathOne, mathTwo);

    case '/':
      return divide(mathOne, mathTwo);

    case '+':
      return add(mathOne, mathTwo);

    case '-':
      return subtract(mathOne, mathTwo);

    default:
      return 'Error, should be a valid operator';
  }
}

let winAnswers = 0;


const firstNumber = getRandomDigit();
const secondNumber = getRandomDigit();
const operator = getRandomOperator();


function checkIfAnswerIsCorrect() {
  const answer = parseInt(document.getElementById('answer').value);
  const correctAnswer = getCorrectResult(firstNumber, secondNumber, operator);
  if (answer === correctAnswer) {
    winAnswers += 1;
    console.log(`${answer} was the correct answer!\nGood job! Correct answers: ${winAnswers}`);
  } else {
    console.log(
      `Ouch! ${answer} was not the correct answer.\n Try again! (correct : ${correctAnswer})`,
    );
  }
}

// display the problem, add input field and a button to check the result

function displayProblem() {
  const question = document.getElementsByClassName('operation__question')[0];
  question.textContent = `${firstNumber} ${operator} ${secondNumber}`;
  const operationItem = document.getElementsByClassName('operation__item')[0];
  question.textContent = `${firstNumber} ${operator} ${secondNumber}`;
  const answerInputWrapper = document.createElement('p');
  const answerInput = document.createElement('input');
  answerInput.id = "answer";
  operationItem.appendChild(answerInputWrapper);
  answerInputWrapper.appendChild(answerInput);
  const submitButton = document.createElement('button');
  submitButton.id = 'submit';
  submitButton.textContent = "submit";
  operationItem.appendChild(submitButton);
  submitButton.addEventListener('click', checkIfAnswerIsCorrect);
}

const uiHandler = {
  populateContent() {
  },
  activateEventListeners() {
    const gameStartBtn = document.getElementById('game__start-btn');
    gameStartBtn.onclick = () => {
      gameStartBtn.classList.toggle('hidden-element');
      displayProblem();
    };
  },
};

// TODO need to create an init fun that will execute the main funs.
uiHandler.activateEventListeners();


// TODO: one problem at a time, when click on submit replace old one and create another one if answer is correct
