import React, { useState, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import UsersDataService from "../../services/UsersDataService";
import { AuthContext } from "../../shared/context/auth-context";
import { Redirect } from "react-router-dom";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import "./Auth.css";

const Auth = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [image, setImage] = useState();

  const handleUsernameFieldChange = (event) => {
    event.preventDefault();
    setUsername(event.target.value);
  };

  const imageInputHandler = useCallback((value) => {
    setImage(value);
    console.log(value);
  }, []);

  const handleEmailFieldChange = (event) => {
    event.preventDefault();
    setEmail(event.target.value);
  };

  const handlePasswordFieldChange = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  const tryLogIn = async (email, password) => {
    const responseData = await UsersDataService.tryUserLogin(email, password);
    auth.login(responseData.userId, responseData.token);
    console.log(responseData);
    setLoggedInUserId(responseData.userId);
    setAuthenticated(true);
  }

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (isLoginMode) {
        await tryLogIn(email, password)
      } else {
        await UsersDataService.addNewUser(username, email, password, image);
        await tryLogIn(email, password)
      }
    } catch(err) {
      alert("Invalid input, please try again.")
    }
  };

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  if (!authenticated) {
    return (
      <Card className="authentication">
        <h2>Login/Sign Up</h2>
        <hr />
        <form onSubmit={formSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              onChange={(e) => handleUsernameFieldChange(e)}
            />
          )}

          {!isLoginMode && (
            <ImageUpload center id="image" onInput={imageInputHandler} />
          )}

          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            errorText="Please enter a valid email address."
            onChange={(e) => handleEmailFieldChange(e)}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            errorText="Please enter a valid password, at least 5 characters."
            onChange={(e) => handlePasswordFieldChange(e)}
          />
          <Button type="submit">{isLoginMode ? "LOGIN" : "SIGNUP"}</Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    );
  } else {
    return <Redirect replace to={`/profile`} />;
  }
};

export default Auth;
