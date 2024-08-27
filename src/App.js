import React, { useState } from "react";
import { Either, curry, compose, map, chain } from "crocks";
import composeK from "crocks/helpers/composeK";

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

const validateExpression = composeK(
  etherCheck(tenOperationsMax),
  etherCheck(tenDigitsMax),
  etherCheck(twoDots),
  etherCheck(doubleDots),
  etherCheck(emptyDot),
  etherCheck(consecutiveOperations),
  checkFirstElement
);
const processExpression = compose(
  chain((str) => Right(splitNumbersOperators(str))),
  map(onlyNumbersOperators),
  checkLastElement
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
function App({ initialExpression = "0" }) {
  const [display, setDisplay] = useState(initialExpression);

  const handleNumberClick = (e) => {
    const number = e.target.getAttribute("data-number");
    const validateValue = display === "0" ? number : display + number;
    const result = validateExpression(validateValue);
    result.either(
      (err) => {
        console.error("Trying to enter illegal expression: " + err);
      },
      (res) => {
        setDisplay(`${res}`);
      }
    );
  };

  const handleOperationClick = (e) => {
    const operation = e.target.getAttribute("data-operation");
    const validateValue = display + operation;
    const result = validateExpression(validateValue);
    result.either(
      (err) => {
        console.error("Trying to enter illegal expression: " + err);
      },
      (res) => {
        setDisplay(`${res}`);
      }
    );

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

  function Display() {
    return (
      <input
        data-testid="display"
        type="text"
        id="display"
        class="w-full bg-gray-200 text-right 
                      p-4 mb-4 border border-gray-300 
                      rounded-md focus:outline-none"
        value={display}
        disabled
      />
    );
  }

  const DeleteButton = ({ name, onClick }) => {
    return (
      <button
        className="bg-gray-300 hover:bg-gray-400 
                   text-gray-800 font-bold py-2 
                   px-4 rounded"
        onClick={onClick}
      >
        {name}
      </button>
    );
  };

  const OperatorButton = ({ name }) => {
    return (
      <button
        className="bg-gray-300 hover:bg-gray-400 
                   text-gray-800 font-bold py-2 
                   px-4 rounded"
        key={name}
        type="button"
        data-operation={name}
        onClick={handleOperationClick}
      >
        {name}
      </button>
    );
  };
  const NumberButton = ({ name }) => {
    return (
      <button
        className="bg-gray-300 hover:bg-gray-400 
                   text-gray-800 font-bold py-2 
                   px-4 rounded"
        key={name}
        type="button"
        data-number={name}
        onClick={handleNumberClick}
      >
        {name}
      </button>
    );
  };

  function CalculatorStyleLink() {
    return (
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        integrity="sha384-HtMZLkYo+pR5/u7zCzXxMJP6QoNnQJt1qkHM0EaOPvGDIzaVZbmYr/TlvUZ/sKAg"
        crossorigin="anonymous"
      ></link>
    );
  }
  function Title() {
    return (
      <h1
        class="text-3xl font-bold 
               text-center mb-4"
      >
        Calculator
      </h1>
    );
  }

  function CalculatorButtons() {
    return (
      <>
        <div class="grid grid-cols-4 gap-2" id="numbers">
          <DeleteButton name="C" onClick={handleDeleteAllClick} />
          <OperatorButton name="(" />
          <OperatorButton name=")" />
          <OperatorButton name="/" />
          <NumberButton name="7" />
          <NumberButton name="8" />
          <NumberButton name="9" />
          <OperatorButton name="*" />
          <NumberButton name="4" />
          <NumberButton name="5" />
          <NumberButton name="6" />
          <OperatorButton name="-" />
          <NumberButton name="1" />
          <NumberButton name="2" />
          <NumberButton name="3" />
          <OperatorButton name="+" />
          <NumberButton name="0" />
          <OperatorButton name="." />
          <OperatorButton name="=" />
          <DeleteButton name="DEL" onClick={handleDeleteClick} />
        </div>
      </>
    );
  }

  return (
    <body
      class="bg-gray-100 flex justify-center 
             items-center h-screen"
    >
      <div
        class="bg-white p-8 rounded-lg shadow-lg 
                border-2 border-green-500"
      >
        <Title />
        <CalculatorStyleLink />
        <Display />
        <CalculatorButtons />
      </div>
    </body>
  );
}
export default App;

