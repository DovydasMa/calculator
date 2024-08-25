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

const validateExpression = compose(
  chain(etherCheck(tenOperationsMax)),
  chain(etherCheck(tenDigitsMax)),
  chain(etherCheck(twoDots)),
  chain(etherCheck(doubleDots)),
  chain(etherCheck(emptyDot)),
  chain(etherCheck(consecutiveOperations)),
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

  function CalculatorButtons() {
    return (
      <>
        <div class="grid grid-cols-4 gap-2" id="numbers">
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            onClick={handleDeleteAllClick}
          >
            C
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key="("
            type="button"
            data-operation="("
            onClick={handleOperationClick}
          >
            (
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key=")"
            type="button"
            data-operation=")"
            onClick={handleOperationClick}
          >
            )
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key="/"
            type="button"
            data-operation={"/"}
            onClick={handleOperationClick}
          >
            /
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key={7}
            type="button"
            data-number={7}
            onClick={handleNumberClick}
          >
            {7}
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key={8}
            type="button"
            data-number={8}
            onClick={handleNumberClick}
          >
            {8}
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key={9}
            type="button"
            data-number={9}
            onClick={handleNumberClick}
          >
            {9}
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key="*"
            type="button"
            data-operation="*"
            onClick={handleOperationClick}
          >
            *
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key={4}
            type="button"
            data-number={4}
            onClick={handleNumberClick}
          >
            {4}
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key={5}
            type="button"
            data-number={5}
            onClick={handleNumberClick}
          >
            {5}
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key={6}
            type="button"
            data-number={6}
            onClick={handleNumberClick}
          >
            {6}
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key="-"
            type="button"
            data-operation="-"
            onClick={handleOperationClick}
          >
            -
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key={1}
            type="button"
            data-number={1}
            onClick={handleNumberClick}
          >
            {1}
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key={2}
            type="button"
            data-number={2}
            onClick={handleNumberClick}
          >
            {2}
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key={3}
            type="button"
            data-number={3}
            onClick={handleNumberClick}
          >
            {3}
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key="+"
            type="button"
            data-operation="+"
            onClick={handleOperationClick}
          >
            +
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key={0}
            type="button"
            data-number={0}
            onClick={handleNumberClick}
          >
            {0}
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key="."
            type="button"
            data-operation="."
            onClick={handleOperationClick}
          >
            .
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            key="="
            type="button"
            data-operation="="
            onClick={handleOperationClick}
          >
            =
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 
                           text-gray-800 font-bold py-2 
                           px-4 rounded"
            onClick={handleDeleteClick}
          >
            DEL
          </button>
        </div>
      </>
    );
  }

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

  return (
    <body
      class="bg-gray-100 flex justify-center 
             items-center h-screen"
    >
      <div
        class="bg-white p-8 rounded-lg shadow-lg 
                border-2 border-green-500"
      >
        <h1
          class="text-3xl font-bold 
                   text-center mb-4"
        >
          Calculator
        </h1>

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          integrity="sha384-HtMZLkYo+pR5/u7zCzXxMJP6QoNnQJt1qkHM0EaOPvGDIzaVZbmYr/TlvUZ/sKAg"
          crossorigin="anonymous"
        ></link>
        <Display />
        <CalculatorButtons />
      </div>
    </body>
  );
}
export default App;
