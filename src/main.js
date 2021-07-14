/*
I'm leaving this here because other people have been using it but getRandomDigit should not be used.
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
  By setting the first operand equal to the sum of the current set of operands,
  we prevent negative numbers
  and also make sure that answers are uniformly distributed.
  For division, a very similar step prevents non-integer results.
  In both cases the first operand becomes the solution.
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
  const problem = makeSimpleProblemString(numDigits, operator, numTerms);
  const userAnswer = Number(prompt(`What is ${problem} equal to?`));
  const correctAnswer = solveExpression(problem);
  if (userAnswer === correctAnswer) {
    winAnswers += 1;
    console.log(`${userAnswer} was the correct answer!\nGood job! Correct answers: ${winAnswers}`);
  } else {
    console.log(
      `Ouch! ${userAnswer} was not the correct answer.\n Try again! (correct : ${correctAnswer})`,
    );
  }
}

askProblem();
