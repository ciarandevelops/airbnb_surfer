import React, { useContext } from "react";
import Button from "../../shared/components/FormElements/Button";
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";

import "./Profile.css";

const Profile = (props) => {
  const auth = useContext(AuthContext);

  const history = useHistory();

  const userId = props.userDetails.user._id;

  const deleteHandler = async () => {
    history.push("/");

    auth.logout();

    try {
      await fetch(`http://localhost:9000/api/v1/delete-user/${userId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card className="profile-card">
      <Card id="avatar-card">
        <h2>{props.userDetails.user.name}</h2>
        <Avatar
          className="avatar-profile"
          image={`http://localhost:9000/${props.userDetails.user.profileImage}`}
        />
      </Card>
      <Button
        id="profile-edit-button"
        to={`/${props.userDetails.user._id}/update-profile/`}
      >
        EDIT
      </Button>
      <Button id="profile-delete-button" inverse onClick={deleteHandler}>
        DELETE
      </Button>
    </Card>
  );
};

export default Profile;
