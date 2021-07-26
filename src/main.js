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

const monsterSelected = monsters[Util.getRandomDigit(monsters.length)];

function createMonsterImg(src, alt) {
  const monster = document.getElementById('monster');
  monster.src = src;
  monster.alt = alt;
}

function monsterGrowth() {
  if (winAnswers === 10) {
    createMonsterImg(monsterSelected.transformation1, monsterSelected.altTransform1);
  } else if (winAnswers === 11) {
    createMonsterImg(monsterSelected.growth1, monsterSelected.alt1);
  } else if (winAnswers === 30) {
    createMonsterImg(monsterSelected.transformation2, monsterSelected.altTransform2);
  } else if (winAnswers === 31) {
    createMonsterImg(monsterSelected.growth2, monsterSelected.alt2);
  } else if (winAnswers === 50) {
    createMonsterImg(monsterSelected.transformation3, monsterSelected.altTransform3);
  } else if (winAnswers === 51) {
    createMonsterImg(monsterSelected.growth3, monsterSelected.alt3);
  } else if (winAnswers === 70) {
    createMonsterImg(monsterSelected.transformation4, monsterSelected.altTransform4);
  } else if (winAnswers === 71) {
    createMonsterImg(monsterSelected.growth4, monsterSelected.alt4);
  }
}

// background switcher

function changeBackground(src) {
  document.body.style.background = `${src}no-repeat center center fixed`;
  document.body.style.backgroundSize = 'cover';
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
  const userAnswer = parseInt(userInputField.value, 10);
  correctAnswer = Problems.solveExpression(problem);
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

const uiHandler = {
  gameStartBtn: document.getElementById('game__start-btn'),
  gameTimer: document.getElementById('game__timer'),
  gameTitle: document.getElementById('opening-title'),
  thunder: document.getElementsByClassName('thunder')[0],
  gameWrapper: document.getElementById('game-wrapper'),
  gameLeftPanel: document.getElementById('game-left-panel'),
  gameRightPanel: document.getElementById('game-right-panel'),
  sidebars: document.getElementsByClassName('sidebar'),

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
      timer.startTimer();
      audioHandler.startBGM();
      this.toggleHiddenElement(this.gameWrapper);
      this.toggleHiddenElement(this.gameTitle);
      this.toggleHiddenElement(this.gameStartBtn);
      this.toggleHiddenElement(this.thunder);
      this.toggleHiddenElement(this.gameLeftPanel);
      this.toggleHiddenElement(this.gameRightPanel);
      this.toggleHiddenElement(this.gameTimer);
      this.toggleColorInSideBars(this.sidebars);
      changeBackground("url('assets/Backgrounds/Interior/interior04.jpg')");
      displayProblem();
      askProblem();
      createMonsterImg('assets/monster/Starter/01.png', 'egg');
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
