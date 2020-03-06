import React from "react";
import styled from "styled-components";

export default props => {
  return (
    <Logo
      alt="logo"
      src="http://www.nippon-ramen-fc.org/wp-content/uploads/2016/10/nrf-title-rng.png"
    ></Logo>
  );
};
const Logo = styled.img`
  width: 10rem;
`;
