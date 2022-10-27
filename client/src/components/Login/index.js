import classNames from "classnames/bind";
import styles from "./Login.module.scss";

import Modal_Center from "../common/Modal/Modal_Center";
import Button from "../common/Button";
import close from "../../assets/image/modal/close-dark.svg";
import facebook from "../../assets/image/login/facebook.svg";
import google from "../../assets/image/login/google.svg";
import person from "../../assets/image/login/person.svg";

const cn = classNames.bind(styles);

function Login() {
    return (
        <Modal_Center className={cn("login-modal")}>
            <div className={cn("header-modal")}>
                <div className={cn("close-btn")}>
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
                        Login with Fackbook
                    </Button>
                    <Button
                        className={cn("btn-login")}
                        classNameImg={cn("img-login")}
                        leftIcon={google}
                        outline
                    >
                        Login with Google
                    </Button>
                    <Button
                        className={cn("btn-login")}
                        classNameImg={cn("img-login")}
                        leftIcon={person}
                        outline
                    >
                        Login with Personal Account
                    </Button>
                </div>
            </div>

            <div className={cn("footer-modal")}></div>
        </Modal_Center>
    );
}

export default Login;
