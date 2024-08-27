import { React, useState } from "react";
import Display from "./components/Display";
import CalculatorButtons from "./components/CalculatorButtons";
import Title from "./components/Title";
import CalculatorStyleLink from "./components/CalculatorStyleLink";
import { calculateResult, validateExpression } from "./utils/calculateHelpers";

function App({ initialExpression = "0" }) {
  const [display, setDisplay] = useState(initialExpression);

  const handleValidation = (validateValue, message) => {
    validateExpression(validateValue).either(
      (err) => {
        console.error(message + err);
      },
      (res) => {
        setDisplay(`${res}`);
      }
    );
  };
  const handleNumberClick = (e) => {
    const number = e.target.getAttribute("data-number");
    handleValidation(
      display === "0" ? number : display + number,
      "Trying to enter illegal expression: "
    );
  };

  const handleOperationClick = (e) => {
    const operation = e.target.getAttribute("data-operation");

    if (operation === "=") {
      calculateResult(display).either(
        (err) => {
          setDisplay(`${err}`);
          console.error("Can't calculate this expression: " + display);
        },
        (res) => {
          setDisplay(`${res}`);
        }
      );
    } else {
      handleValidation(
        display + operation,
        "Trying to enter illegal expression: "
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
