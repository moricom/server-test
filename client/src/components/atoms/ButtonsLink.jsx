import React from "react";
import Link from "react-router-dom/Link";
import styled from "styled-components";

export default props => {
  return (
    <Link
      to={props.to}
      style={{
        color: props.color ? props.color : "white",
        textDecoration: "none"
      }}
    >
      {props.text}
    </Link>
  );
};
