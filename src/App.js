import React, { useState } from "react";
import crocks from "crocks";

const { Either, curry, compose, map, chain } = crocks;

const { Left, Right } = Either;

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
const checkFirstElement = (str) => {
  return isNaN(str[0]) ? Left(str) : Right(str);
};

const validString = curry((exp, str) => str.replace(new RegExp(exp, "g"), ""));
const onlyNumbersOperators = validString("0-9+\\-*/.");
const splitString = curry((exp, str) => str.match(new RegExp(exp, "g")));
const splitNumbersOperators = splitString("(\\d+\\.\\d+|\\d+)|([+\\-*/])");
const checkMatchingPattern = curry((exp, str) => new RegExp(exp).test(str));
const consecutiveOperations = checkMatchingPattern("[+\\-*/]{2,}");
const twoDots = checkMatchingPattern("\\b\\d+(\\.\\d+){2,}\\b");
const emptyDot = checkMatchingPattern("[+\\-*/]\\.");

const checkConsecutiveOperations = (str) => {
  return consecutiveOperations(str) ? Left(str) : Right(str);
};
const checkTwoDots = (str) => {
  return twoDots(str) ? Left(str) : Right(str);
};
const checkEmptyDot = (str) => {
  return emptyDot(str) ? Left(str) : Right(str);
};
const processExpression = compose(
  chain((str) => Right(splitNumbersOperators(str))),
  chain(checkEmptyDot),
  chain(checkTwoDots),
  chain(checkConsecutiveOperations),
  map(onlyNumbersOperators),
  chain(checkLastElement),
  checkFirstElement
);
const arrNumOp = (str) => {
  const numbers = transformToNumbers(str.filter((_, i) => i % 2 === 0));
  const operators = str.filter((_, i) => i % 2 !== 0);
  return { numbers, operators };
};
const calculateResult = compose(
  map(calculate),
  map(arrNumOp),
  processExpression
);
export default function App() {
  const [display, setDisplay] = useState("0");

  const handleNumberClick = (e) => {
    const number = e.target.getAttribute("data-number");
    setDisplay((prev) => (prev === "0" ? number : prev + number));
  };

  const handleOperationClick = (e) => {
    const operation = e.target.getAttribute("data-operation");
    setDisplay((prev) => prev + operation);

    if (operation === "=") {
      const result = calculateResult(display);
      result.either(
        (err) => {
          setDisplay(`${err}`);
          console.error("Can't calculate this expression: " + display);
        },
        (res) => {
          setDisplay(`${res}`);
        }
      );
    }
  };

  const handleDeleteClick = () => {
    setDisplay((prev) => prev.slice(0, -1) || "0");
  };

  const handleDeleteAllClick = () => {
    setDisplay(`0`);
  };

  function NumberButtons() {
    return (
      <>
        <div id="numbers">
          {["9", "8", "7"].map((number) => (
            <button
              key={number}
              type="button"
              data-number={number}
              onClick={handleNumberClick}
            >
              {number}
            </button>
          ))}
        </div>
        <div id="numbers">
          {["6", "5", "4"].map((number) => (
            <button
              key={number}
              type="button"
              data-number={number}
              onClick={handleNumberClick}
            >
              {number}
            </button>
          ))}
        </div>
        <div id="numbers">
          {" "}
          {["3", "2", "1"].map((number) => (
            <button
              key={number}
              type="button"
              data-number={number}
              onClick={handleNumberClick}
            >
              {number}
            </button>
          ))}
        </div>
        <div id="numbers">
          {" "}
          {["0"].map((number) => (
            <button
              key={number}
              type="button"
              data-number={number}
              onClick={handleNumberClick}
            >
              {number}
            </button>
          ))}
        </div>
      </>
    );
  }

  function OperationButtons() {
    return (
      <div id="arithmetic-operations">
        {[".", "*", "/", "-", "+", "="].map((operation) => (
          <button
            key={operation}
            type="button"
            data-operation={operation}
            onClick={handleOperationClick}
          >
            {operation}
          </button>
        ))}
      </div>
    );
  }
  function DeleteButtons() {
    return (
      <div id="delete">
        <button type="button" onClick={handleDeleteClick}>
          DEL
        </button>
        <button type="button" onClick={handleDeleteAllClick}>
          C
        </button>
      </div>
    );
  }

  return (
    <div>
      <div id="display">{display}</div>
      <NumberButtons />
      <OperationButtons />
      <DeleteButtons />
    </div>
  );
}
