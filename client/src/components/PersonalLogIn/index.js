import classNames from "classnames/bind";
import styles from "./PersonalLogIn.module.scss";

import Modal_Center from "../common/Modal/Modal_Center";
import Button from "../common/Button";
import Alert from "../common/Alert";
import LoadingModal from "../common/LoadingModal";

import close from "../../assets/image/modal/close-dark.svg";
import back from "../../assets/image/header/back.svg";
import incorrect from "../../assets/image/login/incorrect.svg";

import { ParentContext } from "../Login";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserInfor } from "../../reducers/LoginStateManager";
import { login } from "../../utils/HttpRequest/auth_request";

const cn = classNames.bind(styles);

function PersonalLogIn() {
    const { setIsOpenPersonalLogInForm, setIsOpenRegisterForm, handleClosePanel } = useContext(ParentContext);
    const [isShowAlertIncorrectLogin, setIsShowAlertIncorrectLogin] = useState("");
    const [isShowLoadingModal, setisShowLoadingModal] = useState(false);
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
        if (username.current.value && password.current.value) {
            loginAuthentication(username.current.value, password.current.value).then((res) => {
                if (typeof res == "object") {
                    dispatch(setUserInfor(res.other));
                    window.localStorage.setItem("accessToken", res.accessToken);
                    handleClosePanel(false);
                } else {
                    setIsShowAlertIncorrectLogin(res);
                }
            });
        }
    }
    // !Login request
    async function loginAuthentication(email, password) {
        setisShowLoadingModal(true);
        const data = await login({
            email,
            password,
        });
        setisShowLoadingModal(false);
        return data;
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
                            content={isShowAlertIncorrectLogin}
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

            {isShowLoadingModal && <LoadingModal />}
        </Modal_Center>
    );
}

export default PersonalLogIn;
