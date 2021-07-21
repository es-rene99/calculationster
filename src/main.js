import * as Util from './modules/util.js';
import * as Problems from './modules/problems.js';

/*
So far we are tracking the number correct in this variable, winAnswers.
*/

let winAnswers = 0;
let problem;
let correctAnswer;
let level;

// functions for monsters and monster growth

const monsters = [
  {
    type: 'dragon',
    growth1: 'assets/monster/Dragon/2.png',
    alt1: 'worm',
    growth2: 'assets/monster/Dragon/3.png',
    alt2: 'snake',
    growth3: 'assets/monster/Dragon/4.png',
    alt3: 'lizard man',
    growth4: 'assets/monster/Dragon/5.png',
    alt4: 'dragon',
  },
  {
    type: 'flying',
    growth1: 'assets/monster/Flying/02.png',
    alt1: 'bat',
    growth2: 'assets/monster/Flying/03.png',
    alt2: 'gargoyle',
    growth3: 'assets/monster/Flying/04.png',
    alt3: 'imp',
    growth4: 'assets/monster/Flying/05.png',
    alt4: 'vampire',
  },
  {
    type: 'ghost',
    growth1: 'assets/monster/Ghost/02.png',
    alt1: 'cloud',
    growth2: 'assets/monster/Ghost/03.png',
    alt2: 'small ghost',
    growth3: 'assets/monster/Ghost/04.png',
    alt3: 'big ghost',
    growth4: 'assets/monster/Ghost/05.png',
    alt4: 'pumpkin ghost',
  },
  {
    type: 'humanoid',
    growth1: 'assets/monster/Humanoid/02.png',
    alt1: 'baby cyclope',
    growth2: 'assets/monster/Humanoid/03.png',
    alt2: 'sad zombie',
    growth3: 'assets/monster/Humanoid/04.png',
    alt3: 'grumpy ogre',
    growth4: 'assets/monster/Humanoid/05.png',
    alt4: 'dark knight',
  }];

const monsterSelected = monsters[Util.getRandomDigit(monsters.length)];

function createMonsterImg(src, alt) {
  const monster = document.getElementById('monster');
  monster.src = src;
  monster.alt = alt;
}

function monsterGrowth() {
  if (level === 2) {
    createMonsterImg(monsterSelected.growth1, monsterSelected.alt1);
  } else if (level === 4) {
    createMonsterImg(monsterSelected.growth2, monsterSelected.alt2);
  } else if (level === 6) {
    createMonsterImg(monsterSelected.growth3, monsterSelected.alt3);
  } else if (level === 8) {
    createMonsterImg(monsterSelected.growth4, monsterSelected.alt4);
  }
}

function askProblem() {
  level = Math.floor((winAnswers / 10)) + 1;
  let numDigits;
  // Sets numTerms equal to two for levels 1-6, then numTerms increments once per level

  // further function for separation

  const numTerms = Math.max(2, level - 4);
  if (level < 5) {
    const operator = ['+', '-', '*', '/'][level - 1];
    numDigits = 1;
    problem = Problems.makeSimpleExpression(numDigits, operator);
  } else {
    numDigits = 2;
    problem = Problems.makeRandomExpression(numTerms, numDigits);
  }
  const question = document.getElementsByClassName('operation__question')[0];
  question.textContent = problem;
}

const timer = {
  sec: 30,
  startTimer() {
    const timeInterval = setInterval(() => {
      const minText = `${Math.floor(this.sec / 60)}`;
      const secText = `0${this.sec % 60}`.slice(-2);
      document.getElementById('gameTimer').innerHTML = `${minText}:${secText}`;
      if (this.sec <= 0) {
        clearInterval(timeInterval);
        document.getElementById('gameTimer').innerHTML = "Time's up!";
      }
      this.sec -= 1;
    }, 1000);
  },
  timerAnswerHandling(typeOfAnswer) {
    if (typeOfAnswer === 'correct') {
      this.sec += 5;
    } else if (typeOfAnswer === 'wrong') {
      this.sec -= 5;
    }
  },
  levelupHandling() {
    this.sec += 20;
  },

};

function checkIfAnswerIsCorrect() {
  const userInputField = document.getElementById('answer');
  const userAnswer = parseInt(userInputField.value, 10);
  correctAnswer = Problems.solveExpression(problem);
  if (userAnswer === correctAnswer) {
    winAnswers += 1;
    if (winAnswers % 10 === 0) {
      timer.levelupHandling();
    }
    userInputField.value = '';
    askProblem();
    monsterGrowth(level);
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
      createMonsterImg('assets/monster/Starter/01.png', 'egg');
    };
  },
};

// * This fun contains the funs executed when the game starts
function main() {
  uiHandler.activateEventListeners();
}
main();
