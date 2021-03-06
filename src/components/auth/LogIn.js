import React, { Component } from "react";
import FormErrors from "../FormErrors";
import Validate from "../utility/FormValidation";
import { Auth, Cache } from "aws-amplify";
import FacebookLoaderButton from "../FacebookLoaderButton";
// Run this after the sign-in

class LogIn extends Component {
  state = {
    username: "",
    password: "",
    errors: {
      cognito: null,
      blankfield: false
    }
  };

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false
      }
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    // Form validation
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }

    // AWS Cognito integration here
    const { username, password } = this.state;
    try {
      const user = await Auth.signIn(username, password);
      this.props.auth.setAuthStatus(true);
      this.props.auth.setUser(user);
      this.props.history.push("/");
    } catch (error) {
      const err = !error.message ? { message: error } : error;
      this.setState({
        errors: {
          ...this.state.errors,
          cognitio: err
        }
      });
    }
  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  };

  handleFBLogin = res => {
    console.log(res);
    const federatedInfo = Cache.getItem("federatedInfo");
    const { token } = federatedInfo;
    console.log(token);
  };

  render() {
    return (
      <section className="section auth">
        <FacebookLoaderButton onLogin={this.handleFBLogin} />
        <div className="container">
          <h1>Log in</h1>
          <FormErrors formerrors={this.state.errors} />

          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <p className="control">
                <input
                  className="input"
                  type="text"
                  id="username"
                  aria-describedby="usernameHelp"
                  placeholder="Enter username or email"
                  value={this.state.username}
                  onChange={this.onInputChange}
                />
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <a href="/forgotpassword">Forgot password?</a>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-success">Login</button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default LogIn;
