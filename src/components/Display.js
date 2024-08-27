import React from "react";

const Display = ({ display }) => {
  return (
    <input
      data-testid="display"
      type="text"
      id="display"
      className="w-full bg-gray-200 text-right 
                 p-4 mb-4 border border-gray-300 
                 rounded-md focus:outline-none"
      value={display}
      disabled
    />
  );
}

export default Display;
