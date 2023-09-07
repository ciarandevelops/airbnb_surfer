class UsersDataService {
  getLoggedInUser = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/get-user/${userId}`
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  };

  addNewUser = async (username, email, password, image) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("image", image);

      const response = await fetch(`http://localhost:9000/api/v1/add-user/`, {
        method: "POST",
        body: formData,
      });
    } catch (err) {}
  };

  tryUserLogin = async (email, password) => {
    try {
      const response = await fetch(`http://localhost:9000/api/v1/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (response.ok) {
        const responseData = await response.json();
        return responseData;
      }
    } catch (err) {
      console.log(err);
    }
  };

  updateUserProfile = async (userId, username, email, password, image) => {
    console.log(username + email + password);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("image", image); // Add the image to the FormData

      const response = await fetch(
        `http://localhost:9000/api/v1/update-user/${userId}`,
        {
          method: "PATCH",
          body: formData, // Use FormData instead of JSON.stringify
        }
      );
    } catch (err) {
      console.error(err);
    }
  };
}
export default new UsersDataService();
