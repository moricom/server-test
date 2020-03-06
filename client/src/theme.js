import { createMuiTheme } from "@material-ui/core/styles";
import deepOrange from "@material-ui/core/colors/deepOrange";
import blue from "@material-ui/core/colors/blue";

export const mainTheme = createMuiTheme({
  palette: {
    primary: {
      main: deepOrange.A400
    }
  }
});

export const secondaryTheme = createMuiTheme({
  palette: {
    primary: {
      main: blue.A400
    }
  }
});
