const { curry, compose, concat } = R;

class Maybe {
  static of(x) {
    return new Maybe(x);
  }

  get isNothing() {
    return (
      this.$value === null ||
      this.$value === undefined ||
      Number.isNaN(this.$value)
    );
  }

  constructor(x) {
    this.$value = x;
  }

  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }

  inspect() {
    return this.isNothing ? "Nothing" : `Just(${inspect(this.$value)})`;
  }
}
const maybe = curry((v, f, m) => {
  if (m.isNothing) {
    return showDisplay(v);
  }

  return f(m.$value);
});

let display = "";

const showDisplay = (display) =>
  (document.getElementById("display").innerHTML = display);
const add = curry((x, y) => x + y);
const divide = curry((num1, num2) => num1 / num2);
const subtract = curry((num1, num2) => num1 - num2);
const multiply = curry((num1, num2) => num1 * num2);

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
const transformToNumbers = (strArray) => {
  return strArray.map((str) => {
    const num = parseFloat(str);
    return num;
  });
};

const checkSecondNumber = (str) => {
  return Maybe.of(isNaN(str[str.length - 1]) ? null : str);
};
const validString = curry((exp, str) => {
  const regex = new RegExp(exp, "g");
  const string = str;
  return string.replace(regex, "");
});
const splitString = curry((exp, str) => {
  const regex = new RegExp(exp, "g");
  const string = str;
  return string.match(regex);
});

const numbers = document.getElementById("numbers");
numbers.addEventListener("click", function (e) {
  const number = e.target.getAttribute("number");
  display += number;
  showDisplay(display);
});
const onlyNumbersOperators = validString("0-9+\\-*/");
const splitNumbersOperators = splitString("(\\d+)|([+\\-*/])");
const processExpression = (str) =>
  compose(
    maybe("missing number", arrNumOp),
    checkSecondNumber,
    splitNumbersOperators,
    maybe("Please enter something", onlyNumbersOperators),
  )(Maybe.of(str));
const calculateResult = ({ numbers, operators }) =>
  compose(showDisplay, calculate)({ numbers, operators });
const arrNumOp = (str) => {
  let numbers = transformToNumbers(str.filter((_, i) => i % 2 === 0));
  let operators = str.filter((_, i) => i % 2 !== 0);
  return { numbers, operators };
};
const operations = document.getElementById("arithmetic-operations");
operations.addEventListener("click", function (e) {
  const operation = e.target.getAttribute("operation");
  display += operation;
  showDisplay(display);

  if (operation == "=") {
    display = calculateResult(processExpression(display));
  }
});

