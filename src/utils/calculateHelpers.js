import { composeK, Either, curry, compose, map, chain } from "crocks";

const { Left, Right } = Either;

export const calculate = ({ numbers, operators }) => {
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === "*" || operators[i] === "/") {
      const num1 = numbers[i];
      const num2 = numbers[i + 1];
      let result;

      switch (operators[i]) {
        case "*":
          result = num1 * num2;
          break;
        case "/":
          result = num1 / num2;
          break;
      }
      numbers.splice(i, 2, result);
      operators.splice(i, 1);
      i--;
    }
  }
  let res = numbers[0];

  for (let i = 0; i < operators.length; i++) {
    const num = numbers[i + 1];
    switch (operators[i]) {
      case "+":
        res += num;
        break;
      case "-":
        res -= num;
        break;
    }
  }

  return res;
};
const validString = (exp, str) => str.replace(new RegExp(exp, "g"), "");

const checkMatchingPattern = curry((exp, str) => new RegExp(exp).test(str));
const splitString = (exp, str) => str.match(new RegExp(exp, "g"));

const etherCheck = (exp) => (str) => {
  return exp(str) ? Left(str) : Right(str);
};

export const validateExpression = composeK(
  etherCheck(checkMatchingPattern("[+\\-*/^]{10,}")),
  etherCheck(checkMatchingPattern("\\d{11,}")),
  etherCheck(checkMatchingPattern("\\d+\\.\\d+\\.$")),
  etherCheck(checkMatchingPattern("\\d*\\.\\.\\d*")),
  etherCheck(checkMatchingPattern("[+\\-*/]\\.")),
  etherCheck(checkMatchingPattern("[+\\-*/]{2,}"))
);
export const processExpression = compose(
  chain((str) => Right(splitString("(\\d+\\.\\d+|\\d+)|([+\\-*/])", str))),
  chain((str) => Right(validString("0-9+\\-*/.", str))),
  (str) => (isNaN(str[str.length - 1]) ? Left(str) : Right(str))
);
export const sepNumOp = (arr) => {
  let numbers = [];
  let operators = [];
  if (arr[0] === "-") {
    numbers.push(parseFloat(arr[0] + arr[1]));
    arr.splice(0, 2);
    operators = arr.filter((_, i) => i % 2 === 0);
    numbers = numbers.concat(arr.filter((_, i) => i % 2 !== 0).map(parseFloat));
  } else {
    numbers = arr.filter((_, i) => i % 2 === 0).map(parseFloat);
    operators = arr.filter((_, i) => i % 2 !== 0);
  }

  return { numbers, operators };
};
export const calculateResult = compose(
  map(calculate),
  map(sepNumOp),
  processExpression
);
