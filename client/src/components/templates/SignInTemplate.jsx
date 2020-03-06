import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { secondaryTheme } from "theme";
import styled from "styled-components";
import grey from "@material-ui/core/colors/grey";

import SignInForm from "components/organisms/SignInForm";
import Logo from "components/atoms/Logo";

export default props => {
  return (
    <MuiThemeProvider theme={secondaryTheme}>
      <StyledSignIn>
        <StyledContainer>
          <LogoContainer>
            <Logo />
          </LogoContainer>
          <FormContainer>
            <SignInForm />
          </FormContainer>
        </StyledContainer>
      </StyledSignIn>
    </MuiThemeProvider>
  );
};

const StyledSignIn = styled.div`
  display: flex;
  background: ${grey[100]};
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const StyledContainer = styled.div`
  display: flex;
  background: white;
  border-radius: 5px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 70%;
  width: 100%;
  max-width: 450px;
  box-sizing: border-box;
  padding: 2rem;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 3rem;
`;
