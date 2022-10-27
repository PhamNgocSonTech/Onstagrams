import classNames from "classnames/bind";
import styles from "./Register.module.scss";

import Modal_Center from "../common/Modal/Modal_Center";
import Button from "../common/Button";

import { ParentContext } from "../Login";

import close from "../../assets/image/modal/close-dark.svg";
import back from "../../assets/image/header/back.svg";
import { useContext } from "react";

const cn = classNames.bind(styles);

function Register() {
    const { setIsOpenRegisterForm, setIsOpenPersonalLogInForm, handleClosePanel } = useContext(ParentContext);

    function handleBackLogInForm() {
        setIsOpenRegisterForm(false);
    }

    function handleCloseAllForm() {
        handleClosePanel(false);
    }

    function handleOpenLoginForm() {
        setIsOpenRegisterForm(false);
        setIsOpenPersonalLogInForm(true);
    }

    return (
        <Modal_Center
            className={cn("register-modal")}
            classNameWrapper={cn("overal-modal")}
        >
            <div className={cn("header-modal")}>
                <div
                    className={cn("back-btn")}
                    onClick={handleBackLogInForm}
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
                <h1 className={cn("text")}>Register</h1>
                <div className={cn("register-section")}>
                    <form>
                        <input
                            className={cn("input-control")}
                            type='text'
                            placeholder='Full Name'
                        />
                        <input
                            className={cn("input-control")}
                            type='text'
                            placeholder='User Name'
                        />
                        <input
                            className={cn("input-control")}
                            type='text'
                            placeholder='Email'
                        />
                        <input
                            className={cn("input-control")}
                            type='password'
                            placeholder='Password'
                        />
                        <input
                            className={cn("input-control")}
                            type='password'
                            placeholder='Input Password Again'
                        />
                        <div className={cn("gender-picker")}>
                            <div className={cn("gender-choose")}>
                                <label
                                    className={cn("gender-label")}
                                    htmlFor='male'
                                >
                                    Male
                                </label>
                                <input
                                    type='radio'
                                    id='male'
                                    name='gender'
                                />
                            </div>

                            <div className={cn("gender-choose")}>
                                <label
                                    className={cn("gender-label")}
                                    htmlFor='fmale'
                                >
                                    Female
                                </label>
                                <input
                                    type='radio'
                                    id='fmale'
                                    name='gender'
                                />
                            </div>

                            <div className={cn("gender-choose")}>
                                <label
                                    className={cn("gender-label")}
                                    htmlFor='hidegd'
                                >
                                    Secret
                                </label>
                                <input
                                    type='radio'
                                    id='hidegd'
                                    name='gender'
                                />
                            </div>
                        </div>
                    </form>
                    <Button
                        primary
                        className={cn("submit")}
                    >
                        Continue
                    </Button>
                </div>
            </div>

            <div className={cn("footer-modal")}>
                <div className={cn("login-recommend")}>
                    <h3>
                        Already have account?{" "}
                        <span
                            className={cn("login-btn")}
                            onClick={handleOpenLoginForm}
                        >
                            Login now!
                        </span>
                    </h3>
                </div>
            </div>
        </Modal_Center>
    );
}

export default Register;
