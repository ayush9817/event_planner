import React from "react";

export default function Button({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inner-head-bg  hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
    >
      {title}
    </button>
  );
}
