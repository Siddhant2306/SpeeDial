import React from "react";
import aiBot from "./Robot-Bot 3D.gif";

const AIFab = ({ onOpen }) => {
  return (
    <div className="ai-wrapper">
      <div className="ai-hover-text">⚡ SPEEDI HERE !</div>

      <button className="ai-btn" onClick={onOpen}>
        <img src={aiBot} alt="AI Bot" className="bot-icon" />
      </button>
    </div>
  );
};

export default AIFab;