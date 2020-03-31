import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Products from "./components/Products";
import ProductAdmin from "./components/ProductAdmin";
import LogIn from "./components/auth/LogIn";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ForgotPasswordVerification from "./components/auth/ForgotPasswordVerification";
import ChangePassword from "./components/auth/ChangePassword";
import ChangePasswordConfirm from "./components/auth/ChangePasswordConfirm";
import Welcome from "./components/auth/Welcome";
import Footer from "./components/Footer";
import config from "./config.json";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Auth } from "aws-amplify";

library.add(faEdit);

class App extends Component {
  state = {
    isAuthenticated: false,
    user: null
  };

  async componentDidMount() {
    this.loadFacebookSDK();

    try {
      const session = await Auth.currentSession();
      console.log(session);
      this.setAuthStatus(true);
      const user = await Auth.currentAuthenticatedUser();
      console.log(user);
      this.setUser(user);
    } catch (error) {
      console.log(error);
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = boolean => this.setAuthStatus(boolean);

  loadFacebookSDK() {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: config.social.FB,
        autoLogAppEvents: true,
        xfbml: true,
        version: "v3.1"
      });
    };

    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }

  setAuthStatus = isAuthenticated => this.setState({ isAuthenticated });

  setUser = user => this.setState({ user });

  render() {
    const authProps = {
      isAuthenticated: this.state.isAuthenticated,
      user: this.state.user,
      setAuthStatus: this.setAuthStatus,
      setUser: this.setUser
    };
    return (
      <div className="App">
        <Router>
          <div>
            <Navbar auth={authProps} />
            <Switch>
              <Route
                exact
                path="/"
                render={props => <Home {...props} auth={authProps} />}
              />
              <Route
                exact
                path="/products"
                render={props => <Products {...props} auth={authProps} />}
              />
              <Route
                exact
                path="/admin"
                render={props => <ProductAdmin {...props} auth={authProps} />}
              />
              <Route
                exact
                path="/login"
                render={props => <LogIn {...props} auth={authProps} />}
              />
              <Route
                exact
                path="/register"
                render={props => <Register {...props} auth={authProps} />}
              />
              <Route
                exact
                path="/forgotpassword"
                render={props => <ForgotPassword {...props} auth={authProps} />}
              />
              <Route
                exact
                path="/forgotpasswordverification"
                render={props => (
                  <ForgotPasswordVerification {...props} auth={authProps} />
                )}
              />
              <Route
                exact
                path="/changepassword"
                render={props => <ChangePassword {...props} auth={authProps} />}
              />
              <Route
                exact
                path="/changepasswordconfirm"
                render={props => (
                  <ChangePasswordConfirm {...props} auth={authProps} />
                )}
              />
              <Route
                exact
                path="/welcome"
                render={props => <Welcome {...props} auth={authProps} />}
              />
            </Switch>
            <Footer />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
