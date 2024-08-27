import React from "react";

const NumberButton = ({ name, onClick }) => {
  return (
    <button
      className="bg-gray-300 hover:bg-gray-400 
                 text-gray-800 font-bold py-2 
                 px-4 rounded"
      key={name}
      type="button"
      data-number={name}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default NumberButton;

