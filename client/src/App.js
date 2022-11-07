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
    const getUser = (id) => {
        return getUserById(id).then((user) => user);
    };

    const token = window.localStorage.getItem("accessToken");
    useEffect(() => {
        console.log(`Check localStorage to get access token`);
        try {
            const decode = jwt_decode(token);
            getUser(decode._id).then((user) => {
                if (user.status === 200) {
                    dispatch(setUserInfor(user.data));
                    console.log(`This person is logged in !`);
                }
            });
        } catch (Ex) {
            console.log(`Not have token => This person doesn't loggin => Force login`);
        }
    }, []);

    return (
        <Routes>
            {pubRoutes.map((route, index) => {
                const Layout =
                    route.layout === null ? React.Fragment : route.layout === undefined ? DefaultLayout : route.layout;
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
