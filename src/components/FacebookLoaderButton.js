import React, { Component } from "react";
import { Auth } from "aws-amplify";

function waitForInit() {
  return new Promise((res, rej) => {
    const hasFbLoaded = () => {
      if (window.FB) {
        res();
      } else {
        setTimeout(hasFbLoaded, 300);
      }
    };
    hasFbLoaded();
  });
}

export default class FacebookButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    await waitForInit();
    this.setState({ isLoading: false });
  }

  statusChangeCallback = response => {
    if (response.status === "connected") {
      this.handleResponse(response);
    } else {
      this.handleError(response);
    }
  };

  checkLoginState = response => {
    if (!response || !response.authResponse) {
      return;
    }
    window.FB.getLoginStatus(this.statusChangeCallback);
  };

  handleClick = () => {
    window.FB.login(this.checkLoginState, { scope: "public_profile,email" });
  };

  handleError(error) {
    alert(error);
  }

  async handleResponse(data) {
    const { accessToken, expiresIn } = data.authResponse;
    const expires_at = expiresIn * 1000 + new Date().getTime();
    if (!accessToken) {
      return;
    }

    this.setState({ isLoading: true });
    const fb = window.FB;
    fb.api("/me", { fields: "name,email" }, async response => {
      const user = {
        name: response.name,
        email: response.email
      };

      try {
        const response = await Auth.federatedSignIn(
          "facebook",
          { accessToken, expires_at },
          user
        );
        this.setState({ isLoading: false });
        this.props.onLogin(response);
      } catch (e) {
        this.setState({ isLoading: false });
        this.handleError(e);
      }
    });
  }

  render() {
    return (
      <button onClick={this.handleClick} disabled={this.state.isLoading}>
        Login With Facebook
      </button>
    );
  }
}
