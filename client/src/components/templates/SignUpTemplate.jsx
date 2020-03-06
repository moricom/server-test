import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Check from "@material-ui/icons/Check";
import StepConnector from "@material-ui/core/StepConnector";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import styled from "styled-components";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { secondaryTheme } from "theme";
import { blue, grey } from "@material-ui/core/colors";
import { TextField } from "@material-ui/core";
import Logo from "components/atoms/Logo";
import ButtonsLink from "components/atoms/ButtonsLink";

import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)"
  },
  active: {
    "& $line": {
      borderColor: blue.A200
    }
  },
  completed: {
    "& $line": {
      borderColor: "#784af4"
    }
  },
  line: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1
  }
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center"
  },
  active: {
    color: "#ff5722"
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor"
  },
  completed: {
    color: blue.A200,
    zIndex: 1,
    fontSize: 18
  }
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool
};

function getSteps() {
  return ["メールアドレス登録", "番号認証", "パスワード登録"];
}

function getStepComponent(step, props = null) {
  switch (step) {
    case 0:
      // メールアドレス入力
      return (
        <>
          <div>
            <Typography variant="h5">メールアドレスの登録</Typography>
          </div>
          <TextContainer>
            <TextField
              fullWidth
              type="email"
              variant="outlined"
              label="メールアドレス"
            />
          </TextContainer>
        </>
      );
    case 1:
      // 確認メールで認証
      return (
        <>
          <div>
            <Typography style={{ textAlign: "center" }} variant="h5">
              確認メールを送信
            </Typography>
            <Typography style={{ paddingTop: "1rem" }} variant="body1">
              メールに記載されている認証番号を入力してください
            </Typography>
          </div>
          <TextContainer>
            <TextField
              fullWidth
              style={{
                WebkitAppearance: "none",
                margin: 0,
                textAlign: "center"
              }}
              type="number"
              variant="outlined"
              label="認証番号"
            />
          </TextContainer>
        </>
      );
    case 2:
      // ニックネームとパスワード入力
      return (
        <>
          <div>
            <Typography variant="h5">ユーザー情報の登録</Typography>
          </div>
          <TextContainer>
            <TextField
              fullWidth
              type="text"
              variant="outlined"
              label="ニックネーム"
            />
            <Typography variant="caption">10文字以内 (任意)</Typography>
          </TextContainer>
          <TextContainer>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                パスワード
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={props.values.showPassword ? "text" : "password"}
                value={props.values.password}
                onChange={props.handleChange("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={props.handleClickShowPassword}
                      onMouseDown={props.handleMouseDownPassword}
                      edge="end"
                    >
                      {props.values.showPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
            </FormControl>
          </TextContainer>
          <TextContainer style={{ paddingTop: "1rem" }}>
            <TextField
              fullWidth
              type={props.values.showPassword ? "text" : "password"}
              value={props.values.confirmPassword}
              onChange={props.handleChange("confirmPassword")}
              variant="outlined"
              label="パスワードの確認"
            />
          </TextContainer>
          <div style={{ width: "100%" }}>
            <Typography style={{ textAlign: "left" }} variant="caption">
              半角英字、数字、記号を組み合わせて8文字以上で入力してください
            </Typography>
          </div>
        </>
      );
    default:
      // 完了
      return (
        <>
          <div>
            <Typography variant="h5">登録完了</Typography>
          </div>
          <LoginButtonContainer>
            <Button size="large" color="primary" variant="contained">
              <ButtonsLink to="/signin" text="ログイン" />
            </Button>
          </LoginButtonContainer>
        </>
      );
  }
}

export default function CustomizedSteppers() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const [values, setValues] = React.useState({
    password: "",
    confirmPassword: "",
    showPassword: false
  });

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  return (
    <MuiThemeProvider theme={secondaryTheme}>
      <StyledSignUp>
        <StepperContainer>
          <Stepper
            alternativeLabel
            activeStep={activeStep}
            connector={<QontoConnector />}
          >
            {steps.map(label => (
              <Step key={label}>
                <StepLabel StepIconComponent={QontoStepIcon}>
                  <Typography variant="caption">{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </StepperContainer>
        <FormWrapper>
          <FormContainer>
            <div>
              <Logo />
            </div>
            <FieldContainer>
              {getStepComponent(activeStep, {
                values,
                handleChange,
                handleClickShowPassword,
                handleMouseDownPassword
              })}
            </FieldContainer>
            {activeStep === steps.length ? (
              <div>
                <StyledButton onClick={handleReset}>Reset</StyledButton>
              </div>
            ) : (
              <ButtonContainer>
                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? "登録" : "次へ"}
                </StyledButton>
                <StyledButton disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </StyledButton>
              </ButtonContainer>
            )}
          </FormContainer>
        </FormWrapper>
      </StyledSignUp>
    </MuiThemeProvider>
  );
}

const StyledSignUp = styled.div`
  background: ${grey[100]};
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const StyledButton = styled(Button)`
  margin-right: ${secondaryTheme.spacing(1)};
`;

const StepperContainer = styled.div`
  width: 100%;
  max-width: 450px;
  padding: 0 1rem;
`;

const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 450px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem 2rem 0 2rem;
  background: white;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row-reverse;
  align-items: flex-end;
  justify-content: space-between;
  padding-top: 2rem;
`;

const FieldContainer = styled.div`
  width: 100%;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.div`
  width: 100%;
  padding-top: 2rem;
`;

const LoginButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 3rem;
`;
