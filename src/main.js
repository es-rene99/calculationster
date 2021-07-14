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

// basic math operands

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

// create random operators

function getRandomOperator() {
  const operators = ['+', '-', '*', '/'];
  const randomOperator = operators[Math.floor(Math.random() * operators.length)];
  return randomOperator;
}

/*
A problem factory to create all our problems!
Feels like I already have too many of these in my life but, oh well...
a simple Object with an array of operands and an array of operators and the answer
*/

function problemFactory(operands, operators, answer) {
  const combinedArray = new Array(operands.length * 2 - 1);
  for (let i = 0; i < operands.length - 1; i += 1) {
    combinedArray[2 * i] = operands[i];
    combinedArray[2 * i + 1] = operators[i];
  }
  combinedArray[operands.length * 2 - 2] = operands[operands.length - 1];
  const text = combinedArray.join(' ');
  return {
    operands,
    operators,
    text,
    answer,
  };
}

/*
This function solves the expression you put into it!
It handles the limited PEMDAS stuff that we need it to as well.
*/

function expressionSolver(operandArray, operatorArray) {
  const operands = [...operandArray];
  const operators = [...operatorArray];
  while (operands.length > 1) {
    let nextOperatorIndex = operators.findIndex((o) => ['*', '/'].includes(o));
    if (nextOperatorIndex === -1) {
      nextOperatorIndex = operators.findIndex((o) => ['+', '-'].includes(o));
    }
    const nextOperator = operators[nextOperatorIndex];
    const nextOperandIndex = nextOperatorIndex;
    const operandOne = operands[nextOperatorIndex];
    const operandTwo = operands[nextOperatorIndex + 1];
    const answerOfNextOperation = getCorrectResult(operandOne, operandTwo, nextOperator);
    operands.splice(nextOperandIndex, 2, answerOfNextOperation);
    operators.splice(nextOperatorIndex, 1);
  }
  return operands[0];
}

/*
Make a simple problem with some number of n digit operands and a single repeated operator
For subtraction, avoids negatives.
For division, avoids fractions.
*/

function makeSimpleProblem(numDigits, operator, numTerms = 2) {
  const operands = [];
  const operators = new Array(numTerms - 1).fill(operator);
  for (let i = 0; i < numTerms; i += 1) {
    operands.push(getRandomInt(1, 10 ** numDigits));
  }
  if (operator === '-') {
    operands[0] = operands.reduce(add);
  } else if (operator === '/') {
    operands[0] = operands.reduce(multiply);
  }
  const answer = expressionSolver(operands, operators);
  return problemFactory(operands, operators, answer);
}

// tracker for ammount of correct answers

let correctResult;

let winAnswers = 0;

function askProblem() {
  const level = Math.floor((winAnswers / 10)) + 1;
  let operator;
  let numDigits;
  const numTerms = Math.max(2, level - 4);
  if (level < 5) {
    operator = ['+', '-', '*', '/'][level - 1];
    numDigits = 1;
  } else {
    operator = getRandomOperator();
    numDigits = 2;
  }
  const problem = makeSimpleProblem(numDigits, operator, numTerms);
  const userAnswer = Number(prompt(`What is ${problem.text} equal to?`));

  if (userAnswer === problem.answer) {
    winAnswers += 1;
    console.log(`${userAnswer} was the correct answer!\nGood job! Correct answers: ${winAnswers}`);
  } else {
    console.log(
      `Ouch! ${userAnswer} was not the correct answer.\n Try again! (correct : ${problem.answer})`,
    );
  }
}

askProblem();
