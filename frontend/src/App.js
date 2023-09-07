import React from "react";
import Home from "./user/profile/Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainNavigation from "./shared/components/navigation/MainNavigation";
import Auth from "./user/pages/Auth";
import UserItem from "./user/components/UserItem";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import UpdateProfile from "./user/profile/UpdateProfile";
import MyPlaces from "./places/components/MyPlaces";

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (!token) {
    routes = (
      <main>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/auth">
            <Auth />
          </Route>
        </Switch>
      </main>
    );
  } else {
    routes = (
      <main>
        <Switch>
          <Route path={`/${userId}/places`} exact>
            <Home />
          </Route>
          <Route path={`/go-to/${userId}/my-places`} exact>
            <MyPlaces userId={userId} />
          </Route>
          <Route path="/auth">
            <Auth />
          </Route>
          <Route path={`/profile`}>
            <UserItem userId={userId} />
          </Route>
          <Route path={`/${userId}/update-profile/`}>
            <UpdateProfile userId={userId} />
          </Route>
        </Switch>
      </main>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
