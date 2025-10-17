import React from "react";

const PixelButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-cyan-400 text-black px-6 py-3 rounded-none shadow-[0_0_10px_#00ffff] 
      hover:bg-white hover:shadow-[0_0_20px_#00ffff] transition-all duration-200
      font-[Press_Start_2P] text-xs"
    >
      {text}
    </button>
  );
};

export default PixelButton;
