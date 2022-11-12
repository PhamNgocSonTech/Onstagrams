import styles from "./Header.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../../assets/image/header/logo.svg";
import plus from "../../../assets/image/header/plus.svg";
import more from "../../../assets/image/header/more.svg";
import search from "../../../assets/image/header/search.svg";
import send from "../../../assets/image/header/send.svg";
import message from "../../../assets/image/header/message.svg";
import load from "../../../assets/image/header/load.svg";

import { useState, useRef, useEffect } from "react";

import Popover_Search from "../../Popover_Search";
import Button from "../Button";
import Popover_Setting from "../../Popover_Setting";
import { MENU_SETTING, MENU_SETTING_USER, export_MENU_SETTING_USER } from "../../../Default/constant";
import PopUpNotification from "../PopUpNotification";
import Tooltip from "../Tooltip";
import useDebounce from "../../../CustomHooks/useDebounce";
import { getUsers } from "../../../utils/HttpRequest/user_request";

import Login from "../../Login";
import { useDispatch, useSelector } from "react-redux";
import { removeUserInfor } from "../../../reducers/LoginStateManager";

const cn = classNames.bind(styles);

function Header({ isShowUploadBtn = true }) {
    const [popover_search, setPopover_search] = useState(false);
    const [isAppear, setIsAppear] = useState(false);
    const [clearBtn, setClearBtn] = useState(false);
    const [SearchText, setSearchText] = useState("");
    const [SearchData, setSearchData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isShowLogInPanel, setIsShowLogInPanel] = useState(false);

    const didLogin = useSelector((state) => state.loginState_reducer.user);
    const dispatch = useDispatch();

    let lastText = useDebounce(SearchText, 500);

    const id = useRef();
    const input = useRef();

    const handleChangeText = (e) => {
        setSearchText(e.target.value);
        if (e.target.value) {
            setLoading(true);
            setClearBtn(false);
        } else {
            setLoading(false);
            setPopover_search(false);
            setClearBtn(false);
            setSearchData([]);
        }
    };

    const handleDeleteText = () => {
        input.current.focus();
        setSearchText("");
        setClearBtn(false);
        setPopover_search(false);
    };

    const handleLogOut = () => {
        dispatch(removeUserInfor());
        window.localStorage.removeItem("accessToken");
        console.log(didLogin);
        setIsAppear(false);
    };

    const handleClickLoginButton = () => {
        setIsShowLogInPanel(true);
    };

    const handleMouseEnter = () => {
        setIsAppear(true);
    };

    const handleMouseLeave = () => {
        id.current = setTimeout(() => {
            setIsAppear(false);
        }, 700);
    };

    const handleMouseBack = () => {
        clearTimeout(id.current);
    };

    const handleCheckAndShowLogIn = () => {
        if (!didLogin) {
            setIsShowLogInPanel(true);
        }
    };

    useEffect(() => {
        if (lastText) {
            getUsers("", {
                nickname: lastText,
            }).then((data) => {
                setPopover_search(true);
                setSearchData(data);
                setLoading(false);
                setClearBtn(true);
            });
        }
    }, [lastText]);

    return (
        <header className={cn("header")}>
            <div className={cn("content")}>
                <Button to='/'>
                    <img
                        src={logo}
                        alt='Tiktok'
                    />
                </Button>
                <div className={cn("search")}>
                    <input
                        ref={input}
                        placeholder='Search accounts and videos'
                        spellCheck={false}
                        value={SearchText}
                        onChange={handleChangeText}
                    />
                    {clearBtn && (
                        <button
                            className={cn("clear-btn")}
                            onClick={handleDeleteText}
                        >
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}

                    {loading && (
                        <motion.img
                            initial={{ y: "-50%" }}
                            animate={{ rotate: 360 }}
                            transition={{
                                repeat: Infinity,
                                ease: "easeIn",
                                duration: 0.5,
                            }}
                            className={cn("load")}
                            src={load}
                        />
                    )}

                    <button className={cn("search-btn")}>
                        <img src={search} />
                    </button>

                    {popover_search && <Popover_Search listdata={SearchData} />}
                </div>

                <div className={cn("actions")}>
                    {isShowUploadBtn && (
                        <Button
                            outline
                            className={cn("size-upload-btn")}
                            onClick={handleCheckAndShowLogIn}
                            leftIcon={plus}
                            to={didLogin && "/upload"}
                        >
                            Upload
                        </Button>
                    )}

                    {didLogin ? (
                        <>
                            <div className={cn("message-icon")}>
                                <img
                                    src={send}
                                    onClick={() => console.log(didLogin)}
                                ></img>
                                <PopUpNotification className={cn("number-notifi")}>10</PopUpNotification>
                                <div className={cn("tooltip-messages")}>
                                    <Tooltip>Messages</Tooltip>
                                </div>
                            </div>
                            <div className={cn("send-icon")}>
                                <img src={message}></img>
                                <PopUpNotification className={cn("number-notifi")}>5</PopUpNotification>
                                <div className={cn("tooltip-inbox")}>
                                    <Tooltip>Inbox</Tooltip>
                                </div>
                            </div>

                            <div
                                className={cn("setting")}
                                onMouseLeave={handleMouseLeave}
                                onMouseEnter={handleMouseEnter}
                            >
                                <img
                                    src={didLogin.avatar}
                                    className={cn("avt")}
                                    alt='avt'
                                />

                                <div
                                    className={cn("setting-popover")}
                                    onMouseEnter={handleMouseBack}
                                >
                                    {isAppear && (
                                        // eslint-disable-next-line react/jsx-pascal-case
                                        <Popover_Setting
                                            menu={[...export_MENU_SETTING_USER(), ...MENU_SETTING]}
                                            logIn
                                            onHandleLogOut={handleLogOut}
                                        />
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={handleClickLoginButton}
                                primary
                            >
                                Log in
                            </Button>

                            <div
                                className={cn("setting")}
                                onMouseLeave={handleMouseLeave}
                                onMouseEnter={handleMouseEnter}
                            >
                                <img
                                    src={more}
                                    className={cn("more-btn")}
                                />

                                <div
                                    className={cn("setting-popover")}
                                    onMouseEnter={handleMouseBack}
                                >
                                    {isAppear && <Popover_Setting menu={MENU_SETTING} />}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* Handle Login <Login handleClosePanel={setIsShowLogInPanel}*/}
            <AnimatePresence>
                {isShowLogInPanel && (
                    <Login
                        key={"login"}
                        handleClosePanel={setIsShowLogInPanel}
                    />
                )}
            </AnimatePresence>
        </header>
    );
}

export default Header;
