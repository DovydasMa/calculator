import { React, useState } from "react";
import Either from "crocks";
import Display from "./components/Display";
import CalculatorButtons from "./components/CalculatorButtons";
import Title from "./components/Title";
import CalculatorStyleLink from "./components/CalculatorStyleLink";
import { calculateResult, validateExpression } from "./utils/calculateHelpers";

const { Left, Right } = Either;

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

  return (
    <div
      className="bg-gray-100 flex justify-center 
                 items-center h-screen"
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg 
                   border-2 border-green-500"
      >
        <Title />
        <CalculatorStyleLink />
        <Display display={display} />
        <CalculatorButtons
          onNumberClick={handleNumberClick}
          onOperationClick={handleOperationClick}
          onDeleteClick={handleDeleteClick}
          onDeleteAllClick={handleDeleteAllClick}
        />
      </div>
    </div>
  );
}

export default App;
