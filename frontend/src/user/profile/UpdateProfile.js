import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import UsersDataService from "../../services/UsersDataService";
import Card from "../../shared/components/UIElements/Card";

import './UpdateProfile.css'

const UpdateProfile = (props) => {
  const [loadedUser, setLoadedUser] = useState();
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState();

  const userId = props.userId;

  useEffect(() => {
    let userNeeded = true;
    const sendRequest = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/api/v1/get-user/${userId}`
        );
        const responseData = await response.json();
        console.log(responseData);
        if (!response.ok) {
          throw new Error(response.message);
        }
        if ((userNeeded = true)) {
          setLoadedUser(responseData);
        }
      } catch (err) {
        console.log(err);
      }
    };
    sendRequest().catch(console.error);
    return () => (userNeeded = false);
  }, []);

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

  const userUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const update = await UsersDataService.updateUserProfile(
        userId,
        username,
        email,
        password,
        image
      );
      history.push("/profile");
    } catch (err) {}
  };

  if (loadedUser) {
    return (
      <React.Fragment>
        <form className="update-form" onSubmit={userUpdateSubmitHandler}>
          <ImageUpload center id="image" onInput={imageInputHandler} />
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            onChange={handleUsernameFieldChange}
            placeholder={loadedUser.user.name}
          />
          <Input
            id="email"
            element="input"
            type="text"
            label="Email"
            onChange={handleEmailFieldChange}
            placeholder={loadedUser.user.email}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            onChange={handlePasswordFieldChange}
            placeholder="Enter a new Password."
          />
        <div>
          <Button type="submit">UPDATE USER</Button>
        </div>
        </form>
      </React.Fragment>
    );
  }
};

export default UpdateProfile;
