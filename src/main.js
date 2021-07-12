function getRandomDigit() {
  return Math.floor(Math.random() * 10);
}

function askProblem() {
  const firstNumber = getRandomDigit();
  const secondNumber = getRandomDigit();
  const answer = Number(prompt(`What is ${firstNumber} + ${secondNumber} equal to?`));
  const correctAnswer = firstNumber + secondNumber;
  if (answer === correctAnswer) {
    console.log(`${answer} was the correct answer!\nGood job!`);
  } else {
    console.log(
      `${answer} was not the correct answer.\nThe correct answer was ${correctAnswer}.`
    );
  }
}
