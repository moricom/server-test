import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Logo from "components/atoms/Logo";

export default props => {
  return (
    <StyledTop>
      <StyledContainer>
        <StyledItem>
          <Logo />
        </StyledItem>
        <StyledItem>
          <Typography style={{ fontSize: "9vw" }} variant="h3">
            ラーメンファンクラブ
          </Typography>
        </StyledItem>
        <StyledItem>
          <Button variant="contained" color="primary" size="large">
            <StyledLink to="/signin">ログイン/会員登録</StyledLink>
          </Button>
        </StyledItem>
      </StyledContainer>
    </StyledTop>
  );
};

const StyledTop = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: flex-start;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 70%;
`;

const StyledItem = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
`;
