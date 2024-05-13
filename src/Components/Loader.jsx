import React from "react";
import "./loader.css";

const LoadingCircle = () => {
  return (
    <div className="loading-wrapper">
      <div className="loading-circle">
        <div className="loading-inner" />
      </div>
      <div className="loading-text">loading ...</div>
    </div>
  );
};

export default LoadingCircle;
