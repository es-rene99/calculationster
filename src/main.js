/*
Returns a random digit [0-9]
I'm leaving this here because other people have been using it but
I feel like getRandomDigit shouldn't be used for generating operands because it returns 0.
*/

function getRandomDigit(num) {
  return Math.floor(Math.random() * num);
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
This function takes an expression string as an input
Returns an expression string with all multiplication and division resolved.
*/

function resolveMultAndDiv(expressionString) {
  const expressionArray = expressionString.split(' ');
  let nextOperatorIndex = expressionArray.findIndex((o) => ['*', '/'].includes(o));
  while (nextOperatorIndex !== -1) {
    const operator = expressionArray[nextOperatorIndex];
    const operandOne = Number(expressionArray[nextOperatorIndex - 1]);
    const operandTwo = Number(expressionArray[nextOperatorIndex + 1]);
    const resultOfNextOperation = getCorrectResult(operandOne, operandTwo, operator);
    expressionArray.splice(nextOperatorIndex - 1, 3, resultOfNextOperation);
    nextOperatorIndex = expressionArray.findIndex((o) => ['*', '/'].includes(o));
  }
  return expressionArray.join(' ');
}

/*
This function solves an expression you put into it in string form!
It handles the limited PEMDAS stuff that we need it to as well.
*/

function solveExpression(expressionString) {
  const expressionResolvedMultAndDiv = resolveMultAndDiv(expressionString);
  const expressionArray = expressionResolvedMultAndDiv.split(' ');
  while (expressionArray.length > 1) {
    const operator = expressionArray[1];
    const operandOne = Number(expressionArray[0]);
    const operandTwo = Number(expressionArray[2]);
    const resultOfNextOperation = getCorrectResult(operandOne, operandTwo, operator);
    expressionArray.splice(0, 3, resultOfNextOperation);
  }
  return parseInt(expressionArray[0], 10);
}

/*
Make a simple problem string with some number of n digit operands and a single repeated operator
For subtraction, avoids negatives.
For division, avoids fractions.
*/

function makeSimpleExpression(numDigits, operator, numTerms = 2) {
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
Input a expression as a string, a new operand, and a new operator to add to the expression.
Output an expression with one more term.
Avoids negative and fractional results at all points during evaluation of new expression.
*/

function addTermToExpression(expression, operand, operator) {
  const expressionArray = expression.split(' ');
  const expressionSolution = solveExpression(expression);
  const expressionArrayResolvedMultAndDiv = resolveMultAndDiv(expression).split(' ');
  if (['+', '*'].includes(operator)) {
    expressionArray.unshift(operand, operator);
  } else if (operator === '-') {
    if (operand >= expressionSolution) {
      const newTerm = operand + Number(expressionArrayResolvedMultAndDiv[0]);
      expressionArray.unshift(newTerm, operator);
    } else {
      expressionArray.push(operator, operand);
    }
  } else {
    // If we're here we are adding a division operator
    expressionArray.unshift(expressionArray[0] * operand, operator);
    expressionArray[2] = operand;
  }
  return expressionArray.join(' ');
}

/*
Generate a random expression with numTerms many terms
And where each term is at most numdigits many digits
*/

function makeRandomExpression(numTerms, numDigits) {
  if (numTerms < 2) {
    return 'Expression must have at least two terms!';
  }
  let expression = makeSimpleExpression(numDigits, getRandomOperator());
  for (let i = 2; i < numTerms; i += 1) {
    const nextOperand = getRandomInt(1, 10 ** numDigits);
    const nextOperator = getRandomOperator();
    expression = addTermToExpression(expression, nextOperand, nextOperator);
  }
  return expression;
}

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
    transformation1: 'assets/monsterTransformation/dragon/dragonT01.gif',
    altTransform1: 'egg to worm',
    transformation2: 'assets/monsterTransformation/dragon/dragonT02.gif',
    altTransform2: 'worm to snake',
    transformation3: 'assets/monsterTransformation/dragon/dragonT03.gif',
    altTransform3: 'snake to lizard man',
    transformation4: 'assets/monsterTransformation/dragon/dragonT04.gif',
    altTransform4: 'lzard man to dragon',
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
    transformation1: 'assets/monsterTransformation/flying/flyingT01.gif',
    altTransform1: 'egg to bat',
    transformation2: 'assets/monsterTransformation/flying/flyingT02.gif',
    altTransform2: 'bat to gargoyle',
    transformation3: 'assets/monsterTransformation/flying/flyingT03.gif',
    altTransform3: 'gargoyle to imp',
    transformation4: 'assets/monsterTransformation/flying/flyingT04.gif',
    altTransform4: 'imp tovampire',
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
    transformation1: 'assets/monsterTransformation/ghost/ghostT01.gif',
    altTransform1: 'egg to cloud',
    transformation2: 'assets/monsterTransformation/ghost/ghostT02.gif',
    altTransform2: 'cloud to ghost',
    transformation3: 'assets/monsterTransformation/ghost/ghostT03.gif',
    altTransform3: 'small ghost to big ghost',
    transformation4: 'assets/monsterTransformation/ghost/ghostT04.gif',
    altTransform4: 'ghost to pumpkin ghostt',
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
    transformation1: 'assets/monsterTransformation/humanoid/humt01.gif',
    altTransform1: 'egg to baby cyclope',
    transformation2: 'assets/monsterTransformation/humanoid/humt02.gif',
    altTransform2: 'baby cyclope to zombie',
    transformation3: 'assets/monsterTransformation/humanoid/humt03.gif',
    altTransform3: 'zombie to grumpy ogre',
    transformation4: 'assets/monsterTransformation/humanoid/humt04.gif',
    altTransform4: 'ogre ot dark knight',

  }];

const monsterSelected = monsters[getRandomDigit(monsters.length)];

function createMonsterImg(src, alt, id) {
  const monsterPlacement = document.getElementById(id);
  monsterPlacement.src = src;
  monsterPlacement.alt = alt;
}

function monsterGrowth() {
  if (winAnswers === 10) {
    createMonsterImg(monsterSelected.transformation1, monsterSelected.altTransform1, 'monster');
  } else if (winAnswers === 11) {
    createMonsterImg(monsterSelected.growth1, monsterSelected.alt1, 'monster');
  } else if (winAnswers === 30) {
    createMonsterImg(monsterSelected.transformation2, monsterSelected.altTransform2, 'monster');
  } else if (winAnswers === 31) {
    createMonsterImg(monsterSelected.growth2, monsterSelected.alt2, 'monster');
  } else if (winAnswers === 50) {
    createMonsterImg(monsterSelected.transformation3, monsterSelected.altTransform3, 'monster');
  } else if (winAnswers === 51) {
    createMonsterImg(monsterSelected.growth3, monsterSelected.alt3, 'monster');
  } else if (winAnswers === 70) {
    createMonsterImg(monsterSelected.transformation4, monsterSelected.altTransform4, 'monster');
  } else if (winAnswers === 71) {
    createMonsterImg(monsterSelected.growth4, monsterSelected.alt4, 'monster');
  }
}

// background switcher

function changeBackground(src) {
  document.body.style.background = `${src}no-repeat center center fixed`;
  document.body.style.backgroundSize = 'cover';
}

function askProblem() {
  level = Math.floor((winAnswers / 10)) + 1;
  let operator;
  let numDigits;

  // Sets numTerms equal to two for levels 1-6, then numTerms increments once per level

  // further function for separation

  const numTerms = Math.max(2, level - 4);
  if (level < 5) {
    operator = ['+', '-', '*', '/'][level - 1];
    numDigits = 1;
    problem = makeSimpleExpression(numDigits, operator);
  } else {
    operator = getRandomOperator();
    numDigits = 2;
    problem = makeRandomExpression(numTerms, numDigits);
  }
  const question = document.getElementsByClassName('operation__question')[0];
  question.textContent = problem;
}

/*
This is a constructor from https://www.w3schools.com/graphics/game_sound.asp for handling gamne sounds.
*/

class Sound {
  constructor(src, loop = false) {
    this.sound = document.createElement('audio');
    this.sound.src = src;
    this.sound.setAttribute('preload', 'auto');
    this.sound.setAttribute('controls', 'none');
    this.sound.setAttribute('playbackRate', '1');
    if (loop) {
      this.sound.setAttribute('loop', loop);
    }
    this.sound.style.display = 'none';
    document.body.appendChild(this.sound);
    this.play = () => this.sound.play();
    this.stop = () => this.sound.pause();
  }
}

/*
Here's an object to handle our audio stuff
*/

const audioHandler = {
  init() {
    this.noises = {
      button: new Sound('../assets/sounds/noises/button-input.mp3'),
      correct: new Sound('../assets/sounds/noises/correct.mp3'),
      gameOver: new Sound('../assets/sounds/noises/game-over.mp3'),
      incorrect: new Sound('../assets/sounds/noises/incorrect.mp3'),
      reward: new Sound('../assets/sounds/noises/reward.mp3'),
    };
    this.loops = {
      gamePlayBGM: new Sound('../assets/sounds/bgm-loop.mp3', true),
      gameOverBGM: new Sound('../assets/sounds/game-over-loop.mp3', true),
      timeWarning: new Sound('../assets/sounds/time-warning-loop.mp3', true),
    };
    this.bgm = this.loops.gamePlayBGM;
  },
  startBGM() {
    this.bgm.play();
  },
  stopBGM() {
    this.bgm.stop();
  },
  changeBGM(bgmTrack) {
    this.bgm.stop();
    this.bgm = this.loops[bgmTrack];
  },
  speedUp() {
    const currentSpeed = Number(this.bgm.sound.playbackRate);
    this.bgm.sound.playbackRate = currentSpeed + 0.2;
  },
  resetSpeed() {
    this.bgm.sound.playbackRate = 1;
  },
  playNoise(noiseName) {
    this.noises[noiseName].play();
  },
  startTimeWarning() {
    this.loops.timeWarning.play();
  },
  stopTimeWarning() {
    this.loops.timeWarning.stop();
  },
  gameOver() {
    this.changeBGM('gameOverBGM');
    this.loops.timeWarning.stop();
    this.startBGM();
  },
};

const timer = {
  sec: 30,
  status: 'running',
  timeDisplay: document.getElementById('gameTimer'),
  animationContainer: document.getElementById('timer-animation-container'),
  updateDisplay(text) {
    this.timeDisplay.innerHTML = text;
  },
  updateTime() {
    const minText = `0${Math.floor(this.sec / 60)}`.slice(-2);
    const secText = `0${this.sec % 60}`.slice(-2);
    this.updateDisplay(`${minText}:${secText}`);
  },
  pause() {
    this.status = 'paused';
  },
  unpause() {
    this.status = 'running';
  },
  pauseFor(numMillisecondsToPauseFor) {
    this.pause();
    setTimeout(() => {
      this.unpause();
    }, numMillisecondsToPauseFor);
  },
  gainSeconds(secondsGained) {
    this.sec += secondsGained;
    const animatedText = document.createElement('div');
    animatedText.innerHTML = `+${secondsGained}`;
    animatedText.classList.add('timer-added-seconds');
    animatedText.onanimationend = () => {
      animatedText.remove();
    };
    this.animationContainer.appendChild(animatedText);
    this.updateTime();
  },
  loseSeconds(secondsLost) {
    this.sec -= secondsLost;
    const animatedText = document.createElement('div');
    animatedText.innerHTML = `-${secondsLost}`;
    animatedText.classList.add('timer-lost-seconds');
    animatedText.onanimationend = () => {
      animatedText.remove();
    };
    this.animationContainer.appendChild(animatedText);
    this.updateTime();
    const timerDiv = document.getElementById('game__timer');
    timerDiv.style.animationPlayState = 'running';
    setTimeout(() => {
      timerDiv.style.animationPlayState = 'paused';
    }, 500);
  },
  gameOver() {
    this.updateDisplay('Time\'s up!');
    audioHandler.gameOver();
    document.getElementById('game-wrapper').innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('gameover____div');
    const text = document.createElement('h1');
    const points = document.createElement('p');
    const losingText = document.createElement('p');
    const image = document.createElement('img');
    image.setAttribute('src', './assets/DeadSkeleton/Skeleton/SkeletonDead.gif');
    image.classList.add('gameover____image');
    text.classList.add('gameover____message');
    const newContent = document.createTextNode('Game Over');
    const result = document.getElementById('game____overdiv');
    const leaderBoard = document.createElement('button');
    leaderBoard.classList.add('gameover____button');
    leaderBoard.innerHTML = 'Go to leaderboard';
    points.innerHTML = `Score: ${winAnswers}`;
    losingText.innerHTML = 'You will get better.';
    div.appendChild(image);
    div.appendChild(text);
    div.appendChild(points);
    div.appendChild(losingText);
    text.appendChild(newContent);
    result.appendChild(div);
    div.appendChild(leaderBoard);
  },
  startTimer() {
    const timeInterval = setInterval(() => {
      if (timer.status === 'running') {
        if (this.sec <= 0) {
          clearInterval(timeInterval);
          this.gameOver();
        }
        this.sec -= 1;
        this.updateTime();
        if (this.sec <= 5 && this.sec > 0) {
          audioHandler.startTimeWarning();
        } else {
          audioHandler.stopTimeWarning();
        }
      }
    }, 1000);
  },
  timerAnswerHandling(typeOfAnswer) {
    if (typeOfAnswer === 'correct') {
      timer.gainSeconds(5);
    } else if (typeOfAnswer === 'wrong') {
      timer.loseSeconds(5);
    }
  },
  levelupHandling() {
    timer.gainSeconds(20);
  },
};

function checkIfAnswerIsCorrect() {
  const userInputField = document.getElementById('answer');
  const userAnswer = parseInt(userInputField.value);
  correctAnswer = solveExpression(problem);
  if (userAnswer === correctAnswer) {
    audioHandler.playNoise('correct');
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
    audioHandler.playNoise('incorrect');
    timer.timerAnswerHandling('wrong');
    console.log(
      `Ouch! ${userAnswer} was not the correct answer.\n Try again! (correct : ${correctAnswer})`,
    );
  }
}

// display the problem, add input field and a button to check the result
function displayProblem() {
  const operationPanel = document.getElementById('operation__panel');
  const answerInputWrapper = document.createElement('div');
  answerInputWrapper.classList.add('answer-input-wrapper');
  const answerInput = document.createElement('input');
  answerInput.id = 'answer';
  const enterAnswerBtn = document.createElement('button');
  enterAnswerBtn.id = 'enter-answer-btn';
  enterAnswerBtn.classList.add('enter-answer-btn');
  enterAnswerBtn.textContent = 'Enter';
  answerInputWrapper.appendChild(answerInput);
  answerInputWrapper.appendChild(enterAnswerBtn);
  operationPanel.appendChild(answerInputWrapper);
  enterAnswerBtn.addEventListener('click', checkIfAnswerIsCorrect);
}

// control the cut scene, change background and introduction animations

let scene = 1;

function sceneControl() {
  if (scene === 1) {
    changeBackground("url('assets/Backgrounds/road/12Z_2104.w026.n002.312B.p1.312.jpg')");
    createMonsterImg('assets/monster/Extras/Wizard.png', 'egg', 'scene1');
    scene += 1;
  } else if (scene === 2) {
    changeBackground("url('assets/Backgrounds/Castle/Cave01.jpg')");
    scene += 1;
  } else if (scene === 3) {
    changeBackground("url('assets/Backgrounds/Prison/prison01.jpg')");
    scene += 1;
  } else if (scene === 4) {
    scene += 1;
  }
}

const uiHandler = {
  gameStartBtn: document.getElementsByClassName('btn-container')[0],
  gameTimer: document.getElementById('game__timer'),
  gameTitle: document.getElementById('opening-title'),
  thunder: document.getElementsByClassName('thunder')[0],
  appWrapper: document.getElementsByClassName('app-wrapper')[0],
  gameWrapper: document.getElementById('game-wrapper'),
  asideLeft: document.getElementsByTagName('aside')[0],
  asideRight: document.getElementsByTagName('aside')[1],
  gameLeftPanel: document.getElementById('game-left-panel'),
  gameRightPanel: document.getElementById('game-right-panel'),
  sidebars: document.getElementsByClassName('sidebar'),
  cutScene: document.getElementById('cut-scene'),
  nextBtn: document.getElementsByClassName('next-scene')[0],

  toggleColorInSideBars(elements) {
    [...elements].forEach((element) => {
      element.classList.toggle('sidebar-colors');
    });
  },
  toggleHiddenElement(element) {
    element.classList.toggle('hidden-element');
  },
  activateEventListeners() {
    this.gameStartBtn.onclick = () => {
      this.toggleHiddenElement(this.cutScene);
      this.toggleHiddenElement(this.nextBtn);
      this.toggleHiddenElement(this.gameTitle);
      this.toggleHiddenElement(this.gameStartBtn);
      this.toggleHiddenElement(this.thunder);
      sceneControl();
    };
    this.nextBtn.onclick = () => {
      sceneControl();
      if (scene === 5) {
        this.toggleHiddenElement(this.appWrapper);
        this.toggleHiddenElement(this.nextBtn);
        this.toggleHiddenElement(this.gameWrapper);
        timer.startTimer();
        audioHandler.startBGM();
        this.toggleHiddenElement(this.asideLeft);
        this.toggleHiddenElement(this.asideRight);
        this.toggleHiddenElement(this.gameLeftPanel);
        this.toggleHiddenElement(this.gameRightPanel);
        this.toggleHiddenElement(this.gameTimer);
        this.toggleColorInSideBars(this.sidebars);
        changeBackground("url('assets/Backgrounds/Interior/interior04.jpg')");
        displayProblem();
        askProblem();
        createMonsterImg('assets/monster/Starter/01.png', 'egg', 'monster');
      }
    };
  },
};
// * This fun contains the funs executed when the game starts
function main() {
  audioHandler.init();
  timer.updateTime();
  uiHandler.activateEventListeners();
}
main();
