import classNames from "classnames/bind";
import styles from "./PersonalLogIn.module.scss";

import Modal_Center from "../common/Modal/Modal_Center";
import Button from "../common/Button";
import Alert from "../common/Alert";
import LoadingModal from "../common/LoadingModal";
import Toast from "../common/Toast";

import close from "../../assets/image/modal/close-dark.svg";
import back from "../../assets/image/header/back.svg";
import incorrect from "../../assets/image/login/incorrect.svg";
import success from "../../assets/image/login/success.svg";

import { ParentContext } from "../Login";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserInfor } from "../../reducers/LoginStateManager";
import { login } from "../../utils/HttpRequest/auth_request";

import show from "../../assets/image/register/show.svg";
import hide from "../../assets/image/register/hide.svg";
import ForgotPassword from "./ForgotPassword";

const cn = classNames.bind(styles);

function PersonalLogIn({ isShowDoneRegister = "" }) {
  const {
    setIsOpenPersonalLogInForm,
    setIsOpenRegisterForm,
    handleClosePanel,
  } = useContext(ParentContext);
  const [isShowAlertIncorrectLogin, setIsShowAlertIncorrectLogin] =
    useState("");
  const [isShowAlertSuccessRegister, setIsShowAlertSuccessRegister] =
    useState(isShowDoneRegister);
  const [isShowLoadingModal, setisShowLoadingModal] = useState(false);

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowEyesIcon, setIsShowEyesIcon] = useState(false);
  const [isShowToast, setIsShowToast] = useState({
    isShow: false,
    message: "",
  });
  const [isShowForgotPassword, setIsShowForgotPassword] = useState(false);
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
    setIsOpenPersonalLogInForm({ open: false, panel: "" });
  }

  function handleOpenRegisterForm() {
    setIsOpenPersonalLogInForm({ open: false, panel: "" });
    setIsOpenRegisterForm(true);
  }

  function handleCloseAllForm() {
    handleClosePanel(false);
  }

  function handleShowHideBtnPW1() {
    setIsShowPassword(!isShowPassword);
  }

  function handleInputPassword(e) {
    if (e.target.value) {
      setIsShowEyesIcon(true);
    } else {
      setIsShowEyesIcon(false);
      setIsShowPassword(false);
    }
  }

  function handleSubmitLogin() {
    setIsShowAlertIncorrectLogin("");

    if (username.current.value && password.current.value) {
      loginAuthentication(username.current.value, password.current.value).then(
        (res) => {
          if (typeof res == "object") {
            console.log(res);
            dispatch(setUserInfor(res.other));
            window.localStorage.setItem("accessToken", res.accessToken);
            window.localStorage.setItem("refreshToken", res.refreshToken);
            window.localStorage.setItem("id", res.other._id);
            setIsShowToast({ isShow: true, message: "Login Sucessfully!" });
            // setTimeout(() => {
            //   window.location.reload(true);
            // }, 1000);
          } else {
            setIsShowAlertIncorrectLogin(res);
            setIsShowAlertSuccessRegister("");
          }
        }
      );
    }
  }
  // !Login request
  async function loginAuthentication(email, password) {
    setisShowLoadingModal(true);
    const data = await login({
      email,
      password,
    });
    console.log(data);
    setisShowLoadingModal(false);
    return data;
  }

  return (
    <Modal_Center
      className={cn("register-modal")}
      classNameWrapper={cn("overal-modal")}>
      <div className={cn("header-modal")}>
        <div className={cn("back-btn")} onClick={handleBackToLogInForm}>
          <img src={back} alt="back" />
        </div>

        <div className={cn("close-btn")} onClick={handleCloseAllForm}>
          <img src={close} alt="close" />
        </div>
      </div>

      <div className={cn("body-modal")}>
        <h1 className={cn("text")}>Login now!</h1>
        <div className={cn("register-section")}>
          {isShowAlertIncorrectLogin && (
            <Alert
              leftImage={incorrect}
              content={isShowAlertIncorrectLogin}
              type="failed"
            />
          )}

          {isShowAlertSuccessRegister && (
            <Alert
              leftImage={success}
              content={isShowAlertSuccessRegister}
              type="success"
            />
          )}

          <form id="login-form" ref={frm}>
            <input
              className={cn("input-control")}
              type="text"
              placeholder="Email"
              ref={username}
              required={true}
            />

            <div className={cn("pw-wrapper")}>
              <input
                className={cn("input-control")}
                type={isShowPassword ? "text" : "password"}
                placeholder="Password"
                required={true}
                ref={password}
                onChange={handleInputPassword}
              />
              {isShowEyesIcon && (
                <img
                  className={cn("show-hide-icon")}
                  src={isShowPassword ? show : hide}
                  alt=""
                  onClick={handleShowHideBtnPW1}
                />
              )}
            </div>
          </form>
          <div
            className={cn("forgot-pass")}
            onClick={() => setIsShowForgotPassword(true)}>
            <p>Forgot password?</p>
          </div>
          <Button
            primary
            className={cn("submit")}
            onClick={handleSubmitLogin}
            form="login-form">
            Log In
          </Button>
        </div>
      </div>

      <div className={cn("footer-modal")}>
        <div className={cn("login-recommend")}>
          <h3>
            Don't have account?{" "}
            <span className={cn("login-btn")} onClick={handleOpenRegisterForm}>
              Register now!
            </span>
          </h3>
        </div>
      </div>

      {isShowLoadingModal && <LoadingModal />}
      {isShowToast.isShow && (
        <Toast message={isShowToast.message} state={true} />
      )}
      {isShowForgotPassword && (
        <ForgotPassword
          toast={setIsShowToast}
          handleCloseForm={setIsShowForgotPassword}
        />
      )}
    </Modal_Center>
  );
}

export default PersonalLogIn;
