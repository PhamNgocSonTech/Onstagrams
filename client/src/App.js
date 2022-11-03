import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "./Default/Layout/DefaultLayout";
import { pubRoutes } from "./Routes/PublicRoutes";

import { getUserById } from "./utils/HttpRequest/user_request";
import { setUserInfor } from "./reducers/LoginStateManager";

import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";

function App() {
    const getUser = (id) => {
        return getUserById(id).then((user) => user);
    };

    const dispatch = useDispatch();

    const token = window.localStorage.getItem("accessToken") ?? "NoneToken";
    try {
        const decode = jwt_decode(token);
        getUser(decode._id).then((user) => {
            if (user.status === 200) {
                console.log(user);
                dispatch(setUserInfor(user.data));
            }
        });
    } catch (Ex) {}

    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
}

export default App;
