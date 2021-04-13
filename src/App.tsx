import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import {ThemeProvider} from "styled-components";
import Chat from "./components/Chat";
import Login from "./components/Login";
import {AuthProvider} from "./context/Auth";
import myTheme, {GlobalStyles} from "./styles/theme";

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <GlobalStyles />

      <Router>
        <AuthProvider>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>

            <Route path="/app">
              <Chat />
            </Route>
          </Switch>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
