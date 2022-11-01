import classNames from "classnames/bind";
import styles from "./PersonalLogIn.module.scss";

import Modal_Center from "../common/Modal/Modal_Center";
import Button from "../common/Button";

import close from "../../assets/image/modal/close-dark.svg";
import back from "../../assets/image/header/back.svg";

import { ParentContext } from "../Login";
import { useContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { acceptLogin } from "../../reducers/LoginStateManager";

const cn = classNames.bind(styles);

function PersonalLogIn() {
    const { setIsOpenPersonalLogInForm, setIsOpenRegisterForm, handleClosePanel } = useContext(ParentContext);

    const dispatch = useDispatch();

    const username = useRef();
    const password = useRef();

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
        if (username.current.value == "123" && password.current.value == "123") {
            handleClosePanel(false);
            dispatch(acceptLogin());
        }
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
                    <form>
                        <input
                            className={cn("input-control")}
                            type='text'
                            placeholder='User Name'
                            ref={username}
                        />
                        <input
                            className={cn("input-control")}
                            type='password'
                            placeholder='Password'
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
