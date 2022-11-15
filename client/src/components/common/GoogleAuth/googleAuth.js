import jwt_decode from "jwt-decode";
import { createContext, useContext, useState } from "react";
import { useGoogleLogin } from "react-google-login";
import { Form } from "react-router-dom";
import { login, register } from "../../../utils/HttpRequest/auth_request";
import { editUser, getAllUsers } from "../../../utils/HttpRequest/user_request";
import { urlToObject } from "../../../utils/URLtoFileObject/convertURL";
import { useDispatch } from "react-redux";
import { setUserInfor } from "../../../reducers/LoginStateManager";
import LoadingModal from "../LoadingModal";

const GoogleAuthContext = createContext();

export const GoogleAuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [isShowLoading, setIsShowLoading] = useState(false);

    const googleHandleSuccess = (res) => {
        setIsShowLoading(true);
        // Data from Google
        const fullname = res.profileObj.name;
        const username =
            res.profileObj.givenName +
            Math.floor(Math.random() * 101) +
            res.profileObj.familyName +
            Math.floor(Math.random() * 101);
        const email = res.profileObj.email;
        const password = res.profileObj.googleId;
        const avatar = res.profileObj.imageUrl;

        // Check to create new account or login
        getAllUsers().then((users) => {
            const isDuplicate = users.filter((user) => user.email === email);
            console.log(isDuplicate);
            if (isDuplicate.length > 0) {
                // This person already has account => Handle Login
                login({
                    email,
                    password,
                }).then((res) => {
                    dispatch(setUserInfor(res.other));
                    window.localStorage.setItem("accessToken", res.accessToken);
                    window.localStorage.setItem("refreshToken", res.refreshToken);
                    setIsShowLoading(false);
                    setTimeout(() => {
                        window.location.reload(true);
                    }, 1000);
                });
            } else {
                // This person doesn't have account => Handle Register + Update
                register({
                    username,
                    fullname,
                    email,
                    password,
                    gender: 3,
                }).then((res) => {
                    if (res.status === 200 || res.status === 304) {
                        const accessToken = res.data.accessTokenJWT;
                        const id = jwt_decode(accessToken)._id;
                        console.log(id);
                        // Edit avatar
                        let frmData = new FormData();
                        urlToObject(avatar, username + ".jpg").then((file) => {
                            frmData.append("img", file, file.name);
                            editUser(accessToken, id, frmData).then((res) => {
                                login({
                                    email,
                                    password,
                                }).then((res) => {
                                    dispatch(setUserInfor(res.other));
                                    window.localStorage.setItem("accessToken", res.accessToken);
                                    window.localStorage.setItem("refreshToken", res.refreshToken);
                                    setIsShowLoading(false);
                                    setTimeout(() => {
                                        window.location.reload(true);
                                    }, 1000);
                                });
                            });
                        });
                    }
                });
            }
        });
    };

    const googleHandleFailed = (res) => {
        console.log(res.profileObj.email);
    };

    const googleAuth = useGoogleLogin({
        clientId: "841192353210-1b7o6v02khn2gs7sl801pbt9hmhjejtu.apps.googleusercontent.com", // Your clientID from Google.
        scope: "",
        onSuccess: googleHandleSuccess,
        onFailure: googleHandleFailed,
        isSignedIn: false,
    });

    return (
        <GoogleAuthContext.Provider value={googleAuth}>
            {children}
            {isShowLoading && <LoadingModal />}
        </GoogleAuthContext.Provider>
    );
};

export const useGoogleAuth = () => useContext(GoogleAuthContext);
