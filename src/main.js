/* eslint-disable no-restricted-syntax */
/* eslint-disable comma-dangle */
/*
getRandomDigit has been refactored to return a random integer between 0 and num
includes 0, excludes num
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
Gets a random element from an array
*/

function getRandomArrayElement(array) {
  return array[getRandomInt(0, array.length)];
}

/*
Fisher-yates array shuffle, implemented to not be in place.
*/
function shuffle(inputArray) {
  const array = [...inputArray];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = getRandomInt(0, i + 1); // random index from 0 to i

    // swap elements array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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
    case 'x':
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
  const operators = ['+', '-', 'x', '/'];
  const randomOperator = getRandomArrayElement(operators);
  return randomOperator;
}

/*
This function takes an expression string as an input
Returns an expression string with all multiplication and division resolved.
*/

function resolveMultAndDiv(expressionString) {
  const expressionArray = expressionString.split(' ');
  let nextOperatorIndex = expressionArray.findIndex((o) => ['x', '/'].includes(o));
  while (nextOperatorIndex !== -1) {
    const operator = expressionArray[nextOperatorIndex];
    const operandOne = Number(expressionArray[nextOperatorIndex - 1]);
    const operandTwo = Number(expressionArray[nextOperatorIndex + 1]);
    const resultOfNextOperation = getCorrectResult(
      operandOne,
      operandTwo,
      operator
    );
    expressionArray.splice(nextOperatorIndex - 1, 3, resultOfNextOperation);
    nextOperatorIndex = expressionArray.findIndex((o) => ['x', '/'].includes(o));
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
    const resultOfNextOperation = getCorrectResult(
      operandOne,
      operandTwo,
      operator
    );
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
  if (['+', 'x'].includes(operator)) {
    expressionArray.unshift(operand, operator);
  } else if (operator === '-') {
    // if we always add to the end of the expression
    // when the new operand is less than the current answer
    // things get kind of boring so we flip a coin about it
    if (operand < expressionSolution) {
      expressionArray.push(operator, operand);
    } else {
      const newTerm = operand + 2 * Number(expressionArrayResolvedMultAndDiv[0]);
      expressionArray.unshift(newTerm, operator);
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
let level = 1;
let count = 0;
const ANSWERS_PER_LEVEL = 5;

function askProblem() {
  level = Math.floor((winAnswers / ANSWERS_PER_LEVEL)) + 1;
  let operator;
  let numDigits;

  // further function for separation

  if (level === 1) {
    numDigits = 1;
    operator = '+';
    problem = makeSimpleExpression(numDigits, operator);
  } else if (level === 2) {
    numDigits = 1;
    operator = '-';
    problem = makeSimpleExpression(numDigits, operator);
  } else if (level === 3) {
    numDigits = 1;
    operator = getRandomArrayElement(['+', '-']);
    problem = makeSimpleExpression(numDigits, operator);
  } else if (level === 4) {
    // We are converting operand1 to a string because it acts as a stub problem string here
    const operand1 = String(getRandomInt(10, 100));
    const operand2 = getRandomInt(1, 10);
    operator = getRandomArrayElement(['+', '-']);
    problem = addTermToExpression(operand1, operand2, operator);
  } else if (level === 5) {
    numDigits = 1;
    operator = 'x';
    problem = makeSimpleExpression(numDigits, operator);
  } else if (level === 6) {
    numDigits = 1;
    operator = '/';
    problem = makeSimpleExpression(numDigits, operator);
  } else if (level === 7) {
    numDigits = 1;
    operator = getRandomArrayElement(['x', '/']);
    problem = makeSimpleExpression(numDigits, operator);
  } else if (level === 8) {
    numDigits = 1;
    operator = getRandomOperator();
    if (['+', '-'].includes(operator)) {
      numDigits = 2;
    }
    problem = makeSimpleExpression(numDigits, operator);
  } else if (level >= 9) {
    operator = getRandomOperator();
    numDigits = 1;
    if (['+', '-'].includes(operator)) {
      numDigits = 2;
    }
    problem = makeSimpleExpression(numDigits, operator);
    operator = getRandomArrayElement(['+', '-']);
    numDigits = 2;
    problem = addTermToExpression(
      problem,
      getRandomInt(1, 10 ** numDigits),
      operator
    );
  }
  const question = document.getElementsByClassName('operation__question')[0];
  question.textContent = problem;
}
/*
Here we activate the different effects
effect1 is the armor
*/

// let effect1 = false;
// let effect2 = false;
// let effect4 = false;
// let isClicked = false;

function buildPower(domElement, enabled) {
  return {
    domElement, enabled,
  };
}

const powers = {
  armor: buildPower(document.getElementById('specialEffect1'), false),
  timeFreeze: buildPower(document.getElementById('specialEffect2'), false),
  secondLife: buildPower(document.getElementById('specialEffect3'), false),
  sharpClaw: buildPower(document.getElementById('specialEffect4'), false),
  wingFoot: buildPower(document.getElementById('specialEffect5'), false),
};

const specialEffects = {
  armorClicked: false,
  armorHits: 0,
  maxArmorHits: 5,
  timeFrozen: false,
  secondLifeUsed: false,
  clawsUsed: 0,
  maxClawUses: 5,
  wingFootTimeGain: 60,
  acquirePower(power) {
    powers[power].enabled = true;
    powers[power].domElement.style.display = 'block';
  },
  removePower(power) {
    powers[power].enabled = false;
    powers[power].domElement.style.display = 'none';
  },
  armorEnabled() {
    if (this.armorClicked) {
      return this.armorHits <= this.maxArmorHits;
    }
    return false;
  },
  useArmor() {
    this.armorHits += 1;
    if (this.armorHits >= this.maxArmorHits) {
      powers.armor.domElement.style.display = 'none';
      this.armorClicked = false;
    } else {
      powers.armor.domElement.style.animationPlayState = 'running';
      setTimeout(() => {
        powers.armor.domElement.style.animationPlayState = 'paused';
      }, 500);
    }
  },
  useTimeFreeze() {
    this.timeFrozen = true;
  },
  useClaw() {
    this.clawsUsed += 1;
    if (this.clawsUsed >= this.maxClawUses) {
      powers.sharpClaw.domElement.style.display = 'none';
    }
    askProblem();
  },
  useWingFoot() {
    if (powers.wingFoot.enabled) {
      this.removePower('wingFoot');
      // most likely, event listeners should just be added in main but for now i'm doing it here
      // which is why timer is being used before it is defined
      timer.gainSeconds(specialEffects.wingFootTimeGain);
    }
  },
  init() {
    powers.armor.domElement.addEventListener('click', () => { specialEffects.armorClicked = true; });
    powers.timeFreeze.domElement.addEventListener('click', () => specialEffects.useTimeFreeze());
    powers.sharpClaw.domElement.addEventListener('click', () => specialEffects.useClaw());
    powers.wingFoot.domElement.addEventListener('click', () => specialEffects.useWingFoot());
  },

};

// background switcher
// Note that src here sets the source for the background to be preloaded

function preloadBackground(src) {
  const nextScene = document.getElementsByClassName(
    'background-image-div preload'
  )[0];
  nextScene.style.background = `${src}no-repeat center center fixed`;
  nextScene.style.backgroundSize = 'cover';
}

function changeToPreloadedBackground() {
  const currentBackground = document.getElementsByClassName(
    'background-image-div current'
  )[0];
  const nextScene = document.getElementsByClassName(
    'background-image-div preload'
  )[0];
  currentBackground.style.zIndex = -3;
  nextScene.style.zIndex = -1;
  nextScene.classList.remove('preload');
  nextScene.classList.add('current');
  currentBackground.classList.remove('current');
  currentBackground.classList.add('preload');
  currentBackground.style.zIndex = -2;
}

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
  },
];

const monsterSelected = getRandomArrayElement(monsters);

function createMonsterImg(src, alt, id) {
  const monsterPlacement = document.getElementById(id);
  monsterPlacement.src = src;
  monsterPlacement.alt = alt;
}

function monsterGrowth() {
  if (winAnswers === 5) {
    // Here is where we ould preload the next level's background
    changeToPreloadedBackground();
    preloadBackground("url('assets/Backgrounds/Interior/interior04.jpg')");
    createMonsterImg(monsterSelected.transformation1, monsterSelected.altTransform1, 'monster');
  } else if (winAnswers === 6) {
    createMonsterImg(monsterSelected.growth1, monsterSelected.alt1, 'monster');
  } else if (winAnswers === 15) {
    createMonsterImg(monsterSelected.transformation2, monsterSelected.altTransform2, 'monster');
  } else if (winAnswers === 16) {
    createMonsterImg(monsterSelected.growth2, monsterSelected.alt2, 'monster');
  } else if (winAnswers === 25) {
    createMonsterImg(monsterSelected.transformation3, monsterSelected.altTransform3, 'monster');
  } else if (winAnswers === 26) {
    createMonsterImg(monsterSelected.growth3, monsterSelected.alt3, 'monster');
  } else if (winAnswers === 35) {
    createMonsterImg(monsterSelected.transformation4, monsterSelected.altTransform4, 'monster');
  } else if (winAnswers === 36) {
    createMonsterImg(monsterSelected.growth4, monsterSelected.alt4, 'monster');
  }
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
      button: new Sound('./assets/sounds/noises/button-input.mp3'),
      correct: new Sound('./assets/sounds/noises/correct.mp3'),
      gameOver: new Sound('./assets/sounds/noises/game-over.mp3'),
      incorrect: new Sound('./assets/sounds/noises/incorrect.mp3'),
      reward: new Sound('./assets/sounds/noises/reward.mp3'),
    };
    this.loops = {
      introBGM: new Sound('./assets/sounds/loops/intro.mp3', true),
      menuThemeBGM: new Sound(
        './assets/sounds/loops/start-menu-theme.mp3',
        true
      ),
      gameOverBGM: new Sound('./assets/sounds/loops/game-over.mp3', true),
      timeWarning: new Sound('./assets/sounds/loops/time-warning.mp3', true),
      gameplayPhaseOneBGM: new Sound(
        './assets/sounds/loops/gameplay-early.mp3',
        true
      ),
      gameplayPhaseTwoBGM: new Sound(
        './assets/sounds/loops/gameplay-mid-1.mp3',
        true
      ),
      gameplayPhaseThreeBGM: new Sound(
        './assets/sounds/loops/gameplay-mid-2.mp3',
        true
      ),
      gameplayPhaseFourBGM: new Sound(
        './assets/sounds/loops/gameplay-late.mp3',
        true
      ),
    };
    this.bgm = this.loops.introBGM;
  },
  startBGM() {
    this.bgm.play();
  },
  stopBGM() {
    this.bgm.stop();
  },
  changeBGM(bgmTrack, startPausedOrPlay = 'paused') {
    this.bgm.stop();
    this.bgm = this.loops[bgmTrack];
    if (startPausedOrPlay === 'play') {
      this.bgm.play();
    }
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
  levelUpHandling() {
    this.playNoise('reward');
    let bgmChanged = true;
    if (level === 3) {
      this.changeBGM('gameplayPhaseTwoBGM');
    } else if (level === 5) {
      this.changeBGM('gameplayPhaseThreeBGM');
    } else if (level === 6) {
      this.changeBGM('gameplayPhaseFourBGM');
    } else {
      bgmChanged = false;
    }
    if (bgmChanged) {
      this.startBGM();
    }
  },
  gameOver() {
    this.changeBGM('gameOverBGM', 'play');
    this.loops.timeWarning.stop();
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
    const image = document.getElementById('specialEffect1');
    image.addEventListener('click', () => {
      this.sec -= 0;
    });
    this.animationContainer.appendChild(animatedText);
    this.updateTime();
    const timerDiv = document.getElementById('game__timer');
    timerDiv.style.animationPlayState = 'running';
    setTimeout(() => {
      timerDiv.style.animationPlayState = 'paused';
    }, 500);
  },
  gameOver() {
    this.updateDisplay("Time's up!");
    audioHandler.gameOver();
    document.getElementById('game-wrapper').innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('gameover____div');
    const text = document.createElement('h1');
    const points = document.createElement('p');
    const losingText = document.createElement('p');
    const image = document.createElement('img');
    image.setAttribute(
      'src',
      './assets/DeadSkeleton/Skeleton/SkeletonDead.gif'
    );
    image.classList.add('gameover____image');
    text.classList.add('gameover____message');
    const newContent = document.createTextNode('Game Over');
    // const result = document.getElementById('game____overdiv');
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
    // result.appendChild(div);
    div.appendChild(leaderBoard);
    document.getElementById('game-wrapper').appendChild(div);
  },
  startTimer() {
    const timeInterval = setInterval(() => {
      if (timer.status === 'running') {
        if (this.sec <= 0) {
          clearInterval(timeInterval);
          this.sec = 0;
          this.gameOver();
        } else if (specialEffects.timeFrozen) {
          this.sec -= 0;
        } else {
          this.sec -= 1;
        }
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
      if (specialEffects.armorEnabled()) {
        timer.loseSeconds(0);
      } else {
        timer.loseSeconds(5);
      }
    }
  },
  levelupHandling() {
    timer.gainSeconds(20);
  },
};

// currently deprecated
// function specialItems() {
//   const image = document.getElementById('specialEffect1');
//   const image1 = document.getElementById('specialEffect2');
//   const image2 = document.getElementById('specialEffect3');
//   const image3 = document.getElementById('specialEffect4');
//   const image4 = document.getElementById('specialEffect5');
// image.className = 'specialEffects__image';
// image1.className = 'specialEffects__image';
// image2.className = 'specialEffects__image';
// image3.className = 'specialEffects__image';
// image4.className = 'specialEffects__image';
// }

// currently deprecated
// function clickedItems() {
//   const getEffect1 = document.getElementById('specialEffect1');
//   getEffect1.addEventListener(
//     'click',
//     () => {
//       effect1 = true;
//       const getCount = document
//         .getElementById('enter-answer-btn')
//         .addEventListener('click', () => {
//           console.log((count += 1));
//         });
//     },
//     { once: true }
//   );
//   const getEffect2 = document.getElementById('specialEffect2');
//   getEffect2.addEventListener(
//     'click',
//     () => {
//       effect2 = true;
//       document
//         .getElementById('enter-answer-btn')
//         .addEventListener('click', () => {
//           isClicked = true;
//         });
//     },
//     { once: true }
//   );

//   const getEffect4 = document.getElementById('specialEffect4');
//   getEffect4.addEventListener(
//     'click',
//     () => {
//       askProblem();
//     },
//     { once: true }
//   );

//   const getEffect5 = document.getElementById('specialEffect5');
//   getEffect5.addEventListener(
//     'click',
//     () => {
//       timer.gainSeconds(60);
//     },
//     { once: true }
//   );
// }

function checkIfAnswerIsCorrect() {
  const userInputField = document.getElementById('answer');
  const userAnswer = parseInt(userInputField.value, 10);
  correctAnswer = solveExpression(problem);
  if (specialEffects.timeFrozen) {
    specialEffects.timeFrozen = false;
    specialEffects.removePower('timeFreeze');
  }
  if (userAnswer === correctAnswer) {
    winAnswers += 1;
    if (winAnswers % ANSWERS_PER_LEVEL === 0) {
      level = Math.floor((winAnswers / ANSWERS_PER_LEVEL)) + 1;
      timer.levelupHandling();
      audioHandler.levelUpHandling(level);
      // Shuffle the array of powers and give the player the first one they don't already have
      const shuffledPowers = shuffle(Object.keys(powers));
      for (const power of shuffledPowers) {
        if (!powers[power].enabled) {
          specialEffects.acquirePower(power);
          break;
        }
      }
    } else {
      timer.timerAnswerHandling('correct');
      audioHandler.playNoise('correct');
    }
    userInputField.value = '';
    askProblem();
    monsterGrowth(level);
    // console.log(
    //  `${userAnswer} was the correct answer!\nGood job! Correct answers: ${winAnswers}`
    // );
  } else {
    userInputField.value = '';
    if (specialEffects.armorEnabled()) {
      // The following noise has not been implemented yet
      // audioHandler.playNoise('armor');
      specialEffects.useArmor();
    } else {
      audioHandler.playNoise('incorrect');
      timer.timerAnswerHandling('wrong');
    }
    // console.log(
    //  `Ouch! ${userAnswer} was not the correct answer.\n Try again! (correct : ${correctAnswer})`,
    // );
  }
  userInputField.focus();
}

// display the problem, add input field and a button to check the result
function displayProblem() {
  const operationPanel = document.getElementById('operation__panel');
  const answerInputWrapper = document.createElement('form');
  answerInputWrapper.addEventListener('click', (e) => {
    e.preventDefault();
  });
  answerInputWrapper.autocomplete = 'off';
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
  answerInput.focus();
}

let scene = 1;

// writer text function used for cut-scene. Function based on css tricks typography effect.

const storyContent = new Array();

storyContent[0] = 'A long time ago lived';
storyContent[1] = 'an evil wizard who dreamt ';
storyContent[2] = 'to conquer the world';
storyContent[3] = 'and force everyone to serve him...';

const iSpeed = 100; // time delay of print out
let iIndex = 0; // start printing array at this posision
let iArrLength = storyContent[0].length; // the length of the text array
const iScrollAt = 20; // start scrolling up at this many lines

let iTextPos = 0; // initialise text position
let sContents = ''; // initialise contents variable
let iRow; // initialise current row

function typewriter() {
  sContents = ' ';
  iRow = Math.max(0, iIndex - iScrollAt);
  const destination = document.getElementById('story');

  while (iRow < iIndex) {
    sContents += `${storyContent[iRow++]}<br />`;
  }
  destination.innerHTML = `${
    sContents + storyContent[iIndex].substring(0, iTextPos)
  }`;
  if (iTextPos++ == iArrLength) {
    iTextPos = 0;
    iIndex++;
    if (iIndex != storyContent.length) {
      iArrLength = storyContent[iIndex].length;
      // eslint-disable-next-line no-implied-eval
      setTimeout('typewriter()', 500);
    }
  } else {
    // eslint-disable-next-line no-implied-eval
    setTimeout('typewriter()', iSpeed);
  }
}

// helper for calling back the function

function resetText() {
  iTextPos = 0;
  iIndex = 0;
  sContents = '';
}

// control the cut scene, change background and introduction animations

function sceneControl() {
  const sceneDiv = document.getElementsByClassName('scene')[0];
  const textFrame = document.getElementById('story');
  const wizard = document.getElementById('wizard1');
  const egg = document.getElementById('egg2');

  if (scene === 1) {
    egg.style.display = 'none';
    createMonsterImg('assets/monster/Extras/Wizard.png', 'wizard', 'wizard1');
    changeToPreloadedBackground();
    preloadBackground("url('assets/Backgrounds/Cave/cave_edited.jpg')");
    typewriter();
    scene += 1;
    resetText();
  } else if (scene === 2) {
    wizard.style.display = 'none';
    egg.style.display = 'inline';
    textFrame.style.paddingTop = '2%';
    storyContent[0] = 'One night he found a cave';
    storyContent[1] = 'and in the cave there was an egg...';
    storyContent[2] = 'He stole it and ran away into his castle';
    storyContent[3] = '"Whatever will come from it will serve me well!"';
    storyContent[4] = '- happilly thought the sorcerrer...';
    changeToPreloadedBackground();
    preloadBackground("url('assets/Backgrounds/Prison/prison01.jpg')");
    createMonsterImg('assets/monster/Starter/01.png', 'egg2', 'egg2');
    scene += 1;
    typewriter();
    resetText();
  } else if (scene === 3) {
    wizard.style.display = 'inline';
    wizard.style.left = '10%';
    wizard.style.bottom = '8%';
    storyContent[0] = 'He locked  the egg in his dungeon';
    storyContent[1] = 'where he used to make his experiments...';
    storyContent[2] =
      '"When you will come out - you will be my favourite server!"';
    storyContent[3] =
      '-said the wizard till he left the creature inside the egg alone...';
    storyContent[4] = '';
    changeToPreloadedBackground();
    preloadBackground("url('assets/Backgrounds/Interior/interior04.jpg')");
    scene += 1;
    resetText();
    typewriter();
  } else if (scene === 4) {
    storyContent[0] =
      'As soon as he left the beast withing tried to break away...';
    storyContent[1] = 'but the shackles of the egg were not letting him out';
    storyContent[2] = 'Then the creature within heard a voice:';
    storyContent[3] =
      '"Eat the knowledge! Solve the problems and you will become stronger...';
    storyContent[4] = '"...Grow enough to get your freedom!"';
    egg.style.animation = 'shake 3s infinite';
    wizard.style.display = 'none';
    scene += 1;
    resetText();
    typewriter();
  } else if (scene === 5) {
    storyContent[0] = 'And then the creature saw...';
    storyContent[1] = '5 + 5 = ?';
    storyContent[2] = 'He thought hard and he answered: 10!';
    storyContent[3] = '2 + 2 = 4! He grew more!';
    storyContent[4] = 'Once again he heard - "Grow as fast as you can..."';
    storyContent[5] = '...escape the castle before the wizard catches you!';
    egg.style.animation = 'grow 10s forwards';
    scene += 1;
    resetText();
    typewriter();
  } else if (scene === 6) {
    sceneDiv.querySelectorAll('*').forEach((n) => n.remove());
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
      audioHandler.startBGM();
    };
    this.nextBtn.onclick = () => {
      sceneControl();
      if (scene === 7) {
        this.toggleHiddenElement(this.appWrapper);
        this.toggleHiddenElement(this.nextBtn);
        this.toggleHiddenElement(this.gameWrapper);
        timer.startTimer();
        audioHandler.changeBGM('gameplayPhaseOneBGM', 'play');
        this.toggleHiddenElement(this.asideLeft);
        this.toggleHiddenElement(this.asideRight);
        this.toggleHiddenElement(this.gameLeftPanel);
        this.toggleHiddenElement(this.gameRightPanel);
        this.toggleHiddenElement(this.gameTimer);
        this.toggleColorInSideBars(this.sidebars);
        displayProblem();
        askProblem();
        // specialItems();
        // clickedItems();
        createMonsterImg('assets/monster/Starter/01.png', 'egg', 'monster');
      }
    };
  },
};
// * This fun contains the funs executed when the game starts
function main() {
  preloadBackground(
    "url('assets/Backgrounds/road/12Z_2104.w026.n002.312B.p1.312.jpg')"
  );
  audioHandler.init();
  specialEffects.init();
  timer.updateTime();
  uiHandler.activateEventListeners();
}
main();
