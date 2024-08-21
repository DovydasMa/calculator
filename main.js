import crocks from "crocks";

const {
  Either,
  curry,
  compose,
  map,
  chain,
} = crocks;

const { Left, Right } = Either;

let display = "";

const calculate = curry(({ numbers, operators }) => {
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

const checkLastElement = (str) => {
  return isNaN(str[str.length - 1]) ? Left(str) : Right(str);
};

const validString = curry((exp, str) => str.replace(new RegExp(exp, "g"), ""));
const onlyNumbersOperators = validString("0-9+\\-*/");
const splitString = curry((exp, str) => str.match(new RegExp(exp, "g")));
const splitNumbersOperators = splitString("(\\d+)|([+\\-*/])");

const processExpression = compose(
  chain((str) => Right(splitNumbersOperators(str))),
  map(onlyNumbersOperators),
  checkLastElement,
);
const arrNumOp = (str) => {
  const numbers = transformToNumbers(str.filter((_, i) => i % 2 === 0));
  const operators = str.filter((_, i) => i % 2 !== 0);
  return { numbers, operators };
};
const calculateResult = compose(
  map(calculate),
  map(arrNumOp),
  processExpression,
);

const showDisplay = (display) => {
  document.getElementById("display").innerHTML = display;
};

const numbers = document.getElementById("numbers");
numbers.addEventListener("click", function (e) {
  const number = e.target.getAttribute("number");
  display += number;
  showDisplay(display);
});

const operations = document.getElementById("arithmetic-operations");
operations.addEventListener("click", function (e) {
  const operation = e.target.getAttribute("operation");
  display += operation;
  showDisplay(display);

  if (operation == "=") {
    const result = calculateResult(display);
    result.either(
      (err) => {
        display = `${err}`;
        console.error("can't calculate this expression:" + display);
      },
      (res) => {
        display = `${res}`;
      },
    );
    showDisplay(display);
  }
});


