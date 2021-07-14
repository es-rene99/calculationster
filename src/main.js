/*
Returns a random single digit number [0-9]
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

function askProblem() {
  let firstNumber = getRandomInt(1, 10);
  const secondNumber = getRandomInt(1, 10);
  const operator = getRandomOperator();
  if (operator === '/') {
    firstNumber *= secondNumber;
  }

  const answer = Number(prompt(`What is ${firstNumber} ${operator} ${secondNumber} equal to?`));
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

askProblem();
