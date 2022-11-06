import classNames from "classnames/bind";
import Modal_Center from "../common/Modal/Modal_Center";
import styles from "./VerifyAccount.module.scss";

import Button from "../common/Button";
import Alert from "../common/Alert";
import sad from "../../assets/image/verify/sad.svg";

import close from "../../assets/image/modal/close-dark.svg";
import ok from "../../assets/image/verify/ok.svg";
import question from "../../assets/image/verify/question.svg";
import { useState } from "react";
import { verifyEmail } from "../../utils/HttpRequest/auth_request";
import LoadingModal from "../common/LoadingModal";

const cn = classNames.bind(styles);

function VerifyAccount({ email, id, setIsShowForm, setHandlePopup }) {
    const [isError, setIsError] = useState("");
    const [optInput, setOptInput] = useState("");
    const [isLoad, setIsLoad] = useState(false);

    const handleInputChange = (e) => {
        setOptInput(e.target.value);
    };

    const handleSubmitOPT = () => {
        setIsLoad(true);
        verifyEmail(id, optInput).then((res) => {
            setIsLoad(false);
            if (res.status === 200) {
                window.location.reload(true);
            } else {
                setIsError(res.data);
            }
        });
    };

    return (
        <Modal_Center className={cn("login-modal")}>
            <div className={cn("header-modal")}>
                {isLoad && <LoadingModal />}
                <div
                    className={cn("close-btn")}
                    onClick={() => {
                        setIsShowForm(false);
                        setHandlePopup(false);
                    }}
                >
                    <img
                        src={close}
                        alt='close'
                    />
                </div>
            </div>

            <div className={cn("body-modal")}>
                <h1 className={cn("text")}>Verify your account</h1>
                <div className={cn("introduce")}>
                    <p>
                        We sent the OTP to <strong>{email}</strong>
                    </p>
                    <p>Please check your mail to get it !</p>
                </div>

                {isError && (
                    <Alert
                        content={isError}
                        type='failed'
                        leftImage={sad}
                    />
                )}

                <div className={cn("login-section")}>
                    <input
                        className={cn("input-control")}
                        type='number'
                        placeholder='Input Your OTP'
                        required={true}
                        value={optInput}
                        onChange={handleInputChange}
                    />
                    <Button
                        className={cn("btn-login")}
                        classNameImg={cn("img-login")}
                        leftIcon={ok}
                        primary
                        onClick={handleSubmitOPT}
                    >
                        Submit
                    </Button>
                </div>
                <div className={cn("des")}>
                    <p className={cn("ques")}>
                        <img
                            src={question}
                            alt=''
                        />
                        Why do I need to verify my email address ?
                    </p>
                    <i>
                        Verifying your email address lets us know that you truly own your email address and allows us to
                        better assist you if you need any support. It also helps us to protect the data you share on
                        Onstagrams’s platform.
                    </i>
                </div>
            </div>
        </Modal_Center>
    );
}

export default VerifyAccount;
