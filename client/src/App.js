import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import DefaultLayout from "./Default/Layout/DefaultLayout";
import { pubRoutes } from "./Routes/PublicRoutes";

import { getUserById } from "./utils/HttpRequest/user_request";
import { setUserInfor } from "./reducers/LoginStateManager";

import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  const userId = window.localStorage.getItem("id");
  console.log("userId", userId);
  useEffect(() => {
    if (userId) {
      try {
        getUserById(userId).then((user) => {
          if (user.status === 200) {
            dispatch(setUserInfor(user.data));
          }
        });
      } catch (Ex) {}
    }
  }, []);

  return (
    <Routes>
      {pubRoutes.map((route, index) => {
        const Layout =
          route.layout === null
            ? React.Fragment
            : route.layout === undefined
            ? DefaultLayout
            : route.layout;
        return (
          <Route
            key={index}
            path={route.path}
            element={
              <Layout {...route.parameters}>
                <route.element />
              </Layout>
            }
          />
        );
      })}
    </Routes>
  );
}

export default App;
