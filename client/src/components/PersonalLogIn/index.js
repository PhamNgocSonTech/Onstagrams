import classNames from "classnames/bind";
import styles from "./PersonalLogIn.module.scss";

import Modal_Center from "../common/Modal/Modal_Center";
import Button from "../common/Button";
import Alert from "../common/Alert";

import close from "../../assets/image/modal/close-dark.svg";
import back from "../../assets/image/header/back.svg";
import incorrect from "../../assets/image/login/incorrect.svg";

import { ParentContext } from "../Login";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { acceptLogin } from "../../reducers/LoginStateManager";
import { login } from "../../utils/HttpRequest/auth_request";
import { getUsers2 } from "../../utils/HttpRequest/user_request";

const cn = classNames.bind(styles);

function PersonalLogIn() {
    const { setIsOpenPersonalLogInForm, setIsOpenRegisterForm, handleClosePanel } = useContext(ParentContext);
    const [isShowAlertIncorrectLogin, setIsShowAlertIncorrectLogin] = useState(false);
    const [dataUser, setDataUser] = useState({});
    const frm = useRef();

    const dispatch = useDispatch();

    const username = useRef();
    const password = useRef();

    useEffect(() => {
        frm.current.addEventListener("submit", (e) => {
            e.preventDefault();
        });
    }, []);

    function handleBackToLogInForm() {
        setIsOpenPersonalLogInForm(false);
    }

    function handleOpenRegisterForm() {
        setIsOpenPersonalLogInForm(false);
        setIsOpenRegisterForm(true);
    }

    function handleCloseAllForm() {
        handleClosePanel(false);
    }

    function handleSubmitLogin() {
        loginFetch("hc19082001@gmail.com", "123123").then((res) => console.log(res));
    }

    // !Login request
    async function loginAuthentication(email, password) {
        const data = await login({
            email,
            password,
        });
        return data;
    }

    async function getListUserFetch() {
        return await fetch("http://localhost:5000/api/user/getListUsers/")
            .then((res) => res.json())
            .then((data) => data);
    }

    async function loginFetch(email, password) {
        return await fetch("http://localhost:5000/api/auth/login/", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "content-type",
            },
            mode: "cors",
            credentials: "include",
            body: JSON.stringify({
                email,
                password,
            }),
        }).then((res) => res.json());
    }

    async function loginAxios(email, password) {
        return await login({
            email,
            password,
        }).then((res) => res);
    }

    return (
        <Modal_Center
            className={cn("register-modal")}
            classNameWrapper={cn("overal-modal")}
        >
            <div className={cn("header-modal")}>
                <div
                    className={cn("back-btn")}
                    onClick={handleBackToLogInForm}
                >
                    <img
                        src={back}
                        alt='back'
                    />
                </div>

                <div
                    className={cn("close-btn")}
                    onClick={handleCloseAllForm}
                >
                    <img
                        src={close}
                        alt='close'
                    />
                </div>
            </div>

            <div className={cn("body-modal")}>
                <h1 className={cn("text")}>Login now!</h1>
                <div className={cn("register-section")}>
                    {isShowAlertIncorrectLogin && (
                        <Alert
                            leftImage={incorrect}
                            content='Incorrect username or password'
                        />
                    )}

                    <form
                        id='login-form'
                        ref={frm}
                    >
                        <input
                            className={cn("input-control")}
                            type='text'
                            placeholder='User Name'
                            ref={username}
                            required={true}
                        />
                        <input
                            className={cn("input-control")}
                            type='password'
                            placeholder='Password'
                            required={true}
                            ref={password}
                        />
                    </form>
                    <div className={cn("forgot-pass")}>
                        <p>Forgot password?</p>
                    </div>
                    <Button
                        primary
                        className={cn("submit")}
                        onClick={handleSubmitLogin}
                        form='login-form'
                    >
                        Log In
                    </Button>
                </div>
            </div>

            <div className={cn("footer-modal")}>
                <div className={cn("login-recommend")}>
                    <h3>
                        Don't have account?{" "}
                        <span
                            className={cn("login-btn")}
                            onClick={handleOpenRegisterForm}
                        >
                            Register now!
                        </span>
                    </h3>
                </div>
            </div>
        </Modal_Center>
    );
}

export default PersonalLogIn;
