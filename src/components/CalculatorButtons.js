import React from "react";
import DeleteButton from "./DeleteButton";
import OperatorButton from "./OperatorButton";
import NumberButton from "./NumberButton";

const CalculatorButtons = ({
  onNumberClick,
  onOperationClick,
  onDeleteClick,
  onDeleteAllClick,
}) => {
  return (
    <div className="grid grid-cols-4 gap-2" id="numbers">
      <DeleteButton name="C" onClick={onDeleteAllClick} />
      <OperatorButton name="(" onClick={onOperationClick} />
      <OperatorButton name=")" onClick={onOperationClick} />
      <OperatorButton name="/" onClick={onOperationClick} />
      <NumberButton name="7" onClick={onNumberClick} />
      <NumberButton name="8" onClick={onNumberClick} />
      <NumberButton name="9" onClick={onNumberClick} />
      <OperatorButton name="*" onClick={onOperationClick} />
      <NumberButton name="4" onClick={onNumberClick} />
      <NumberButton name="5" onClick={onNumberClick} />
      <NumberButton name="6" onClick={onNumberClick} />
      <OperatorButton name="-" onClick={onOperationClick} />
      <NumberButton name="1" onClick={onNumberClick} />
      <NumberButton name="2" onClick={onNumberClick} />
      <NumberButton name="3" onClick={onNumberClick} />
      <OperatorButton name="+" onClick={onOperationClick} />
      <NumberButton name="0" onClick={onNumberClick} />
      <OperatorButton name="." onClick={onOperationClick} />
      <OperatorButton name="=" onClick={onOperationClick} />
      <DeleteButton name="DEL" onClick={onDeleteClick} />
    </div>
  );
};

export default CalculatorButtons;
