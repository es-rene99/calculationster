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

function askProblem() {
  const firstNumber = getRandomDigit();
  const secondNumber = getRandomDigit();
  const operator = getRandomOperator();
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
