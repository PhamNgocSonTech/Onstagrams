import classNames from "classnames/bind";
import styles from "./Login.module.scss";

import Modal_Center from "../common/Modal/Modal_Center";
import Button from "../common/Button";

import close from "../../assets/image/modal/close-dark.svg";
import facebook from "../../assets/image/login/facebook.svg";
import google from "../../assets/image/login/google.svg";
import person from "../../assets/image/login/person.svg";

import PersonalLogIn from "../PersonalLogIn";
import Register from "../Register";
import { createContext, useState } from "react";

const cn = classNames.bind(styles);
export const ParentContext = createContext();

function Login({ handleClosePanel }) {
    const [isOpenRegisterForm, setIsOpenRegisterForm] = useState(false);
    const [isOpenPersonalLogInForm, setIsOpenPersonalLogInForm] = useState(false);

    function handleCloseModal() {
        handleClosePanel(false);
    }

    function handleOpenRegisterForm() {
        setIsOpenRegisterForm(true);
    }

    function handleOpenPersonalLogInForm() {
        setIsOpenPersonalLogInForm(true);
    }

    const googleHandle = () => {
        window.open("https://localhost:5000/api/auth/login-google", "_self");
    };

    return (
        <ParentContext.Provider
            value={{
                setIsOpenRegisterForm,
                setIsOpenPersonalLogInForm,
                handleClosePanel,
            }}
        >
            <Modal_Center className={cn("login-modal")}>
                <div className={cn("header-modal")}>
                    <div
                        className={cn("close-btn")}
                        onClick={handleCloseModal}
                    >
                        <img
                            src={close}
                            alt='close'
                        />
                    </div>
                </div>

                <div className={cn("body-modal")}>
                    <h1 className={cn("text")}>Login to Onstagrams</h1>
                    <div className={cn("login-section")}>
                        <Button
                            className={cn("btn-login")}
                            classNameImg={cn("img-login")}
                            leftIcon={facebook}
                            outline
                        >
                            Login with Facebook
                        </Button>
                        <Button
                            className={cn("btn-login")}
                            classNameImg={cn("img-login")}
                            leftIcon={google}
                            onClick={googleHandle}
                            outline
                        >
                            Login with Google
                        </Button>
                        <Button
                            className={cn("btn-login")}
                            classNameImg={cn("img-login")}
                            leftIcon={person}
                            outline
                            onClick={handleOpenPersonalLogInForm}
                        >
                            Login with Onstagrams Account
                        </Button>
                    </div>
                </div>

                <div className={cn("footer-modal")}>
                    <div className={cn("register-recommend")}>
                        <h3>
                            Don't have account?{" "}
                            <span
                                className={cn("register-btn")}
                                onClick={handleOpenRegisterForm}
                            >
                                Register now!
                            </span>
                        </h3>
                    </div>
                </div>

                {/* Handle Open Another Form */}
                {isOpenRegisterForm && <Register />}
                {isOpenPersonalLogInForm && <PersonalLogIn />}
            </Modal_Center>
        </ParentContext.Provider>
    );
}

export default Login;
