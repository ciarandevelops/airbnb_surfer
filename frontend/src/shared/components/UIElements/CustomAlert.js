import React from "react";
import "./CustomAlert.css"; // Import your custom CSS for styling

import ReactDOM from "react-dom";

function CustomAlert({ message, onClose }) {
  return ReactDOM.createPortal(
    <div className="custom-alert-content">
      <p>{message}</p>
      <button onClick={onClose}>OK</button>
    </div>,
    document.getElementById("alert-hook")
  );
}

export default CustomAlert;
