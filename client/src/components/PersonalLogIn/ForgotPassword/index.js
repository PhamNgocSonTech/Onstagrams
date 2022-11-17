import classNames from "classnames/bind";
import Modal_Center from "../../common/Modal/Modal_Center";
import styles from "./ForgotPassword.module.scss";

import close from "../../../assets/image/modal/close-dark.svg";
import back from "../../../assets/image/header/back.svg";
import incorrect from "../../../assets/image/login/incorrect.svg";
import success from "../../../assets/image/login/success.svg";
import Button from "../../common/Button";
import Alert from "../../common/Alert";
import sad from "../../../assets/image/verify/sad.svg";

import ok from "../../../assets/image/verify/ok.svg";

import question from "../../../assets/image/verify/question.svg";
import { useEffect, useRef, useState } from "react";
import { forgotPassword, resetPassword } from "../../../utils/HttpRequest/auth_request";
import Login from "../../Login";
import LoadingModal from "../../common/LoadingModal";

const cn = classNames.bind(styles);

function ForgotPassword({ handleCloseForm, toast }) {
    const [displaySection, setDisplaySection] = useState(1);

    const [inputEmail, setInputEmail] = useState("");

    const [inputOTP, setInputOTP] = useState("");

    const [inputPassword, setInputPassword] = useState("");

    const [inputPasswordAgain, setInputPasswordAgain] = useState("");

    const [isShowAlert, setIsShowAlert] = useState("");

    const [isShowLoadingModal, setIsShowLoadingModal] = useState(false);

    const handleSendOTP = () => {
        setIsShowLoadingModal(true);
        forgotPassword(inputEmail).then(() => {
            setIsShowLoadingModal(false);
            setDisplaySection(2);
        });
    };

    const handleChangePassword = () => {
        if (inputPassword === inputPasswordAgain && inputPassword) {
            setIsShowLoadingModal(true);

            resetPassword(inputOTP, inputPassword, inputEmail).then((res) => {
                if (res.status === 200) {
                    handleCloseForm(false);
                    toast({ isShow: true, message: "Change password successfully !" });
                } else {
                    setIsShowAlert(res.data);
                }
                setIsShowLoadingModal(false);
            });
        } else {
            setIsShowAlert("Password input again is invalid with above one");
        }
    };

    return (
        <Modal_Center
            className={cn("register-modal")}
            classNameWrapper={cn("overal-modal")}
        >
            <div className={cn("header-modal")}>
                <div className={cn("close-btn")}>
                    <img
                        src={close}
                        alt='close'
                        onClick={() => handleCloseForm(false)}
                    />
                </div>
            </div>

            {/* 1. Input Email */}
            {displaySection === 1 && (
                <div>
                    <div className={cn("body-modal")}>
                        <h1 className={cn("text")}>Input your email </h1>
                        <div className={cn("register-section")}>
                            <form>
                                <input
                                    className={cn("input-control")}
                                    type='email'
                                    placeholder='Your email'
                                    required={true}
                                    value={inputEmail}
                                    onChange={(e) => setInputEmail(e.target.value)}
                                />
                            </form>
                            <Button
                                primary
                                className={cn("submit")}
                                onClick={handleSendOTP}
                            >
                                Accept
                            </Button>

                            <div className={cn("des")}>
                                <p className={cn("ques")}>
                                    <img
                                        src={question}
                                        alt=''
                                    />
                                    How to change or reset your password ?
                                </p>
                                <i>
                                    <ol>
                                        <li>
                                            <b>Input your email you registered on Onstagrams</b>
                                        </li>
                                        <li>Input otp code which we sent to your email</li>
                                        <li>Input new password and confirm</li>
                                    </ol>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Verify */}
            {displaySection === 2 && (
                <div className={cn("body-modal-2")}>
                    <h1 className={cn("text")}>Check your mail !</h1>
                    {isShowAlert && (
                        <Alert
                            leftImage={incorrect}
                            content={isShowAlert}
                            type='failed'
                        />
                    )}
                    <div className={cn("introduce")}>
                        <p>
                            We sent the reset code to <strong>{inputEmail}</strong>
                        </p>
                        <p>Please check your mail to get it !</p>
                    </div>

                    <div className={cn("login-section")}>
                        <input
                            className={cn("input-control")}
                            type='text'
                            placeholder='Input Your Reset Code'
                            required={true}
                            value={inputOTP}
                            onChange={(e) => setInputOTP(e.target.value)}
                        />
                    </div>

                    <form>
                        <input
                            className={cn("input-control")}
                            type='password'
                            placeholder='New password'
                            required={true}
                            value={inputPassword}
                            onChange={(e) => setInputPassword(e.target.value)}
                        />

                        <div className={cn("pw-wrapper")}>
                            <input
                                type={"password"}
                                className={cn("input-control")}
                                placeholder='New password again'
                                required={true}
                                value={inputPasswordAgain}
                                onChange={(e) => setInputPasswordAgain(e.target.value)}
                            />
                        </div>
                    </form>

                    <Button
                        primary
                        className={cn("submit")}
                        onClick={handleChangePassword}
                    >
                        Accept
                    </Button>
                </div>
            )}
            {isShowLoadingModal && <LoadingModal />}
        </Modal_Center>
    );
}

export default ForgotPassword;
