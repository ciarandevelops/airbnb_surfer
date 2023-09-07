import React from "react";

import "./Card.css";

const Card = (props) => {
  return (
    <div id={props.id} className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
