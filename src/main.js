function getRandomDigit() {
  return Math.floor(Math.random() * 10);
}

// create random operators

function getRandomOperator(){
    const operators = ["+", "-", "*", "/"];
    let randomOperator = operators[Math.floor(Math.random() * operators.length)]
    return randomOperator;
}

// tracker for ammount of correct answers

let correctResult;

// basic math operands

let add = (a, b) => a + b;
let subtract = (a, b) => a - b;
let multiply = (a, b) => a * b;
let divide = (a, b) =>  a / b;


function getCorrectResult(mathOne, mathTwo, operatorValue){

      switch(operatorValue){
        case '*':
            return multiply(mathOne, mathTwo); 
             break;
         case  '/':
            return divide(mathOne, mathTwo);
            break;
        case '+':
            return add(mathOne, mathTwo);  
            break;
        case '-':
           return subtract(mathOne, mathTwo);;    
            break;
        default:
            operatorValue = "";
    }
  }



let winAnswers = 0;

function askProblem() {
  const firstNumber = getRandomDigit();
  const secondNumber = getRandomDigit();
  const operator = getRandomOperator();
  const answer = Number(prompt(`What is ${firstNumber} ${operator} ${secondNumber} equal to?`));
  const correctAnswer = getCorrectResult(firstNumber, secondNumber, operator)
  if (answer === correctAnswer) {
    winAnswers ++;
    console.log(`${answer} was the correct answer!\nGood job! Correct answers: ${winAnswers}`);
  } else {
    console.log(
      `Ouch! ${answer} was not the correct answer.\n Try again! (correct : ${correctAnswer})`
    );
  }
}


