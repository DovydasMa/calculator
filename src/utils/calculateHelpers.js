import { Either, curry, compose, map, chain } from "crocks";
import composeK from "crocks/helpers/composeK";

const { Left, Right } = Either;

export const calculate = curry(({ numbers, operators }) => {
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
});

const transformToNumbers = map(parseFloat);
const validString = curry((exp, str) => str.replace(new RegExp(exp, "g"), ""));
const onlyNumbersOperators = validString("0-9+\\-*/.");
const splitString = curry((exp, str) => str.match(new RegExp(exp, "g")));
const splitNumbersOperators = splitString("(\\d+\\.\\d+|\\d+)|([+\\-*/])");
const checkMatchingPattern = curry((exp, str) => new RegExp(exp).test(str));
const consecutiveOperations = checkMatchingPattern("[+\\-*/]{2,}");
const twoDots = checkMatchingPattern("\\d+\\.\\d+\\.$");
const doubleDots = checkMatchingPattern("\\d*\\.\\.\\d*");
const emptyDot = checkMatchingPattern("[+\\-*/]\\.");
const tenDigitsMax = checkMatchingPattern("\\d{11,}");
const tenOperationsMax = checkMatchingPattern("[+\\-*/^]{10,}");

const checkLastElement = (str) => {
  return isNaN(str[str.length - 1]) ? Left(str) : Right(str);
};
const checkFirstElement = (str) => {
  return isNaN(str[0]) ? Left(str) : Right(str);
};
const etherCheck = (exp) => (str) => {
  return exp(str) ? Left(str) : Right(str);
};

export const validateExpression = composeK(
  etherCheck(tenOperationsMax),
  etherCheck(tenDigitsMax),
  etherCheck(twoDots),
  etherCheck(doubleDots),
  etherCheck(emptyDot),
  etherCheck(consecutiveOperations),
  checkFirstElement
);
export const processExpression = compose(
  chain((str) => Right(splitNumbersOperators(str))),
  map(onlyNumbersOperators),
  checkLastElement
);
export const arrNumOp = (str) => {
  const numbers = transformToNumbers(str.filter((_, i) => i % 2 === 0));
  const operators = str.filter((_, i) => i % 2 !== 0);
  return { numbers, operators };
};
export const calculateResult = compose(
  map(calculate),
  map(arrNumOp),
  processExpression
);
