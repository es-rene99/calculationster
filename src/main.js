/*
Returns a random digit [0-9]
I'm leaving this here because other people have been using it but
I feel like getRandomDigit shouldn't be used for generating operands because it returns 0.
*/

function getRandomDigit() {
  return Math.floor(Math.random() * 10);
}

/*
Returns a random integer in a range including the lower bound but excluding the upper bound.
*/

function getRandomInt(min, max) {
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);
  return Math.floor(Math.random() * (maxInt - minInt) + minInt);
}

/*
 basic math operands
*/

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

/*
Solve a single operation
*/

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

/*
Returns a random operator
*/

function getRandomOperator() {
  const operators = ['+', '-', '*', '/'];
  const randomOperator = operators[Math.floor(Math.random() * operators.length)];
  return randomOperator;
}

/*
This function solves an expression you put into it in string form!
It handles the limited PEMDAS stuff that we need it to as well.
*/

function solveExpression(expressionString) {
  const expressionArray = expressionString.split(' ');
  while (expressionArray.length > 1) {
    // We must find the next instance of multiplication or division to perform
    let nextOperatorIndex = expressionArray.findIndex((o) => ['*', '/'].includes(o));
    // If there is no more multiplication or division we can move on to addition or subtraction
    if (nextOperatorIndex === -1) {
      nextOperatorIndex = expressionArray.findIndex((o) => ['+', '-'].includes(o));
    }
    const operator = expressionArray[nextOperatorIndex];
    const operandOne = Number(expressionArray[nextOperatorIndex - 1]);
    const operandTwo = Number(expressionArray[nextOperatorIndex + 1]);
    const resultOfNextOperation = getCorrectResult(operandOne, operandTwo, operator);
    expressionArray.splice(nextOperatorIndex - 1, 3, resultOfNextOperation);
  }
  return expressionArray[0];
}

/*
Make a simple problem string with some number of n digit operands and a single repeated operator
For subtraction, avoids negatives.
For division, avoids fractions.
*/

function makeSimpleProblemString(numDigits, operator, numTerms = 2) {
  const operands = [];
  for (let i = 0; i < numTerms; i += 1) {
    operands.push(getRandomInt(1, 10 ** numDigits));
  }
  /*
  When doing subtraction, we set the first operand equal to the sum of the current set of operands,
  which prevents negative numbers
  and also makes sure that answers are uniformly distributed.
  For division, a very similar step prevents non-integer results.
  In both cases the first operand actually ends up becoming the answer.
  */
  if (operator === '-') {
    operands[0] = operands.reduce(add);
  } else if (operator === '/') {
    operands[0] = operands.reduce(multiply);
  }
  return operands.join(` ${operator} `);
}

/*
So far we are tracking the number correct in this variable, winAnswers.
*/

let winAnswers = 0;
let problem;
let correctAnswer;

function askProblem() {
  const level = Math.floor((winAnswers / 10)) + 1;
  let operator;
  let numDigits;
  // Sets numTerms equal to two for levels 1-6, then numTerms increments once per level

  // further function for separation

  const numTerms = Math.max(2, level - 4);
  if (level < 5) {
    operator = ['+', '-', '*', '/'][level - 1];
    numDigits = 1;
  } else {
    operator = getRandomOperator();
    numDigits = 2;
  }
  problem = makeSimpleProblemString(numDigits, operator, numTerms);

  const question = document.getElementsByClassName('operation__question')[0];
  question.textContent = problem;
}

const timer = {
  minute: 4,
  sec: 59,
  startTimer() {
    const timeInterval = setInterval(() => {
      document.getElementById('gameTimer').innerHTML = `${this.minute}:${this.sec}`;
      if (this.sec <= 0) {
        this.minute -= 1;
        this.sec = 59;
        if (this.minute <= 0) {
          this.minute = 0;
          clearInterval(timeInterval);
          document.getElementById('gameTimer').innerHTML = "Time's up!";
        }
      }
      this.sec -= 1;
    }, 1000);
  },
  timerAnswerHandling(typeOfAnswer) {
    if (typeOfAnswer === 'correct') {
      this.sec += 30;
    } else if (typeOfAnswer === 'wrong') {
      this.sec -= 5;
    }
  },

};

function checkIfAnswerIsCorrect() {
  const userInputField = document.getElementById('answer');
  const userAnswer = parseInt(userInputField.value);
  correctAnswer = solveExpression(problem);
  if (userAnswer === correctAnswer) {
    winAnswers += 1;
    userInputField.value = '';
    askProblem();
    console.log(`${userAnswer} was the correct answer!\nGood job! Correct answers: ${winAnswers}`);
    timer.timerAnswerHandling('correct');
  } else {
    timer.timerAnswerHandling('wrong');
    console.log(
      `Ouch! ${userAnswer} was not the correct answer.\n Try again! (correct : ${correctAnswer})`,
    );
  }
}

// display the problem, add input field and a button to check the result
function displayProblem() {
  const operationItem = document.getElementsByClassName('operation__item')[0];
  const answerInputWrapper = document.createElement('p');
  const answerInput = document.createElement('input');
  answerInput.id = 'answer';
  operationItem.appendChild(answerInputWrapper);
  answerInputWrapper.appendChild(answerInput);
  const submitButton = document.createElement('button');
  submitButton.id = 'submit';
  submitButton.textContent = 'submit';
  operationItem.appendChild(submitButton);
  submitButton.addEventListener('click', checkIfAnswerIsCorrect);
}

const uiHandler = {
  gameStartBtn: document.getElementById('game__start-btn'),
  gameTimer: document.getElementById('game__timer'),
  toggleHiddenElement(element) {
    element.classList.toggle('hidden-element');
  },
  activateEventListeners() {
    this.gameStartBtn.onclick = () => {
      timer.startTimer();
      this.toggleHiddenElement(this.gameStartBtn);
      this.toggleHiddenElement(this.gameTimer);
      displayProblem();
      askProblem();
    };
  },
};

// * This fun contains the funs executed when the game starts
function main() {
  uiHandler.activateEventListeners();
}
main();
