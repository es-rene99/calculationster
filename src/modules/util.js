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

export {
  getRandomDigit,
  getRandomInt,
};
