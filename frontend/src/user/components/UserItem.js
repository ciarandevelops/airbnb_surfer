import React, { useState, useEffect } from "react";
import UsersDataService from "../../services/UsersDataService";
import Profile from "../profile/Profile";

const UserItem = (props) => {
  const [loadedUser, setLoadedUser] = useState();

  const loggedInUserId = props.userId;

  useEffect(() => {
    const sendRequest = async () => {
      try {
        const response = await UsersDataService.getLoggedInUser(loggedInUserId);
        const responseData = await response.json();
        setLoadedUser(responseData);
        if (!response.ok) {
          throw new Error(response.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
    sendRequest();
  }, []);

  return (
    <React.Fragment>
      {loadedUser && <Profile userDetails={loadedUser} />}
    </React.Fragment>
  );
};

export default UserItem;
