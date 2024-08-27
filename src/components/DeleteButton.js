import React from "react";

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

export default DeleteButton;
