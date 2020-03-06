import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Top from "components/pages/TopPage";
import SignUp from "components/pages/SignUpPage";
import SignIn from "components/pages/SignInPage";
import Test from "components/pages/test";

import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={Top} />
          <Route path="/signin" exact component={SignIn} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/test" exact component={Test} />
          <Route exact component={Top} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
