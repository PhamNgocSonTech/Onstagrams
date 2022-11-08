/* eslint-disable react/jsx-pascal-case */
import classNames from "classnames/bind";
import AccountItem from "../../AccountItem";
import Button from "../Button";
import Sidebar_DivSecondary from "./Sidebar_FrameSecondary";
import MainBar from "./MainBar";
import styles from "./Sidebar.module.scss";
import { Skeleton } from "@mui/material";

import { DICOVER_SECTION } from "../../../Default/constant";
import Sidebar_Footer from "./Sidebar_Footer";
import ProfilePopover from "../../ProfilePopover";
import Login from "../../Login";
import { createContext, useEffect, useRef, useState } from "react";
import no_following from "../../../assets/image/sidebar/no_following.svg";

import {
    getAllUsers,
    getFollowersOfUser,
    getFollowingsOfUser,
    getUsers,
} from "../../../utils/HttpRequest/user_request";

const cn = classNames.bind(styles);
export const TopPosition = createContext();

function Sidebar({
    className,
    isShowPopUp = true,
    isShowLoginSection = false,

    followerAccounts = false,
    followingAccounts = true,

    suggestAcounts = true,

    userId,
}) {
    const [SuggestdAccounts, setSuggestdAccounts] = useState([]); // 100% have data
    const [FollowingAccounts, setFollowingAccounts] = useState([]); // If dont have data => Show area div => OK
    const [FollowerAccounts, setFollowerAccounts] = useState([]); // If dont have data => Hide
    const [showLoginForm, setShowLoginForm] = useState(false);
    let idLeave = useRef();
    let idHover = useRef();

    const [isGetAPIDone, setIsGetAPIDone] = useState(false);
    const [isGetAPIFollowingDone, setIsGetFollowingAPIDone] = useState(false);
    useEffect(() => {
        if (userId) {
            // If have followerAccounts => Handle
            if (followerAccounts) {
                getFollowersOfUser(userId).then((res) => setFollowerAccounts(res));
            }
            // If have followingAccounts => Hanndle
            if (followingAccounts) {
                getFollowingsOfUser(userId).then((res) => {
                    setFollowingAccounts(res);
                    setIsGetFollowingAPIDone(true);
                });
            }
        }
        // Not loggin or Logged in can get Suggestd Account
        getAllUsers().then((res) => {
            console.log(res);
            setSuggestdAccounts(res);
        });
        setIsGetAPIDone(true);
    }, [userId]);

    const [Profile, setProfile] = useState({
        index: -1,
        user: null,
    });

    const handleScrollSideBar = (e) => {
        // console.log(e.target.pageYOffset);
    };

    const handleHover = (user, index) => {
        idHover.current = setTimeout(() => {
            setProfile({
                index,
                user,
            });
        }, 1000);
    };

    const handleLeave = () => {
        clearTimeout(idHover.current);
        if (Profile.index !== -1) {
            clearTimeout(idLeave.current);
            idLeave.current = setTimeout(() => {
                setProfile({
                    index: -1,
                    user: null,
                });
            }, 1000);
        }
    };

    const handleProfileEnter = () => {
        clearTimeout(idLeave.current);
    };

    const handleProfileLeave = () => {
        setProfile({
            index: -1,
            user: null,
        });
    };

    return (
        <div>
            {showLoginForm && (
                <Login
                    handleClosePanel={setShowLoginForm}
                    className={cn("login-form")}
                />
            )}
            <aside
                className={cn("sidebar", { [className]: className })}
                onScroll={handleScrollSideBar}
            >
                <MainBar />

                {isShowLoginSection && (
                    <Sidebar_DivSecondary className={cn("loggin-need")}>
                        <p>Log in to follow creators, like videos, and view comments.</p>
                        <Button
                            outlinePrimary
                            className={cn("btn-loggin-need")}
                            onClick={() => setShowLoginForm(true)}
                        >
                            ✨ Login now ✨
                        </Button>
                    </Sidebar_DivSecondary>
                )}

                {followerAccounts && FollowerAccounts.length > 0 && (
                    <Sidebar_DivSecondary
                        title='Follower accounts'
                        seeall={SuggestdAccounts.length >= 5}
                    >
                        {!isGetAPIDone ? (
                            <div>
                                <div style={{ display: "flex", marginBottom: "20px" }}>
                                    <div>
                                        <Skeleton
                                            variant='circular'
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div style={{ marginLeft: "10px" }}>
                                        <Skeleton
                                            variant='text'
                                            sx={{ fontSize: "15px", width: "120px" }}
                                        />
                                        <Skeleton
                                            variant='text'
                                            sx={{ fontSize: "10px", width: "90px" }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "flex", marginBottom: "20px" }}>
                                    <div>
                                        <Skeleton
                                            variant='circular'
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div style={{ marginLeft: "10px" }}>
                                        <Skeleton
                                            variant='text'
                                            sx={{ fontSize: "15px", width: "120px" }}
                                        />
                                        <Skeleton
                                            variant='text'
                                            sx={{ fontSize: "10px", width: "90px" }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "flex", marginBottom: "20px" }}>
                                    <div>
                                        <Skeleton
                                            variant='circular'
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div style={{ marginLeft: "10px" }}>
                                        <Skeleton
                                            variant='text'
                                            sx={{ fontSize: "15px", width: "120px" }}
                                        />
                                        <Skeleton
                                            variant='text'
                                            sx={{ fontSize: "10px", width: "90px" }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "flex", marginBottom: "20px" }}>
                                    <div>
                                        <Skeleton
                                            variant='circular'
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div style={{ marginLeft: "10px" }}>
                                        <Skeleton
                                            variant='text'
                                            sx={{ fontSize: "15px", width: "120px" }}
                                        />
                                        <Skeleton
                                            variant='text'
                                            sx={{ fontSize: "10px", width: "90px" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            FollowerAccounts.map((user, index) => (
                                <AccountItem
                                    bold
                                    smdes
                                    userInfor={user}
                                    key={index}
                                />
                            ))
                        )}
                    </Sidebar_DivSecondary>
                )}

                {suggestAcounts && (
                    <Sidebar_DivSecondary
                        title='Suggested accounts'
                        seeall={SuggestdAccounts.length >= 5}
                    >
                        <div className={cn("container")}>
                            {!isGetAPIDone ? (
                                <div>
                                    <div style={{ display: "flex", marginBottom: "20px" }}>
                                        <div>
                                            <Skeleton
                                                variant='circular'
                                                width={40}
                                                height={40}
                                            />
                                        </div>
                                        <div style={{ marginLeft: "10px" }}>
                                            <Skeleton
                                                variant='text'
                                                sx={{ fontSize: "15px", width: "120px" }}
                                            />
                                            <Skeleton
                                                variant='text'
                                                sx={{ fontSize: "10px", width: "90px" }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", marginBottom: "20px" }}>
                                        <div>
                                            <Skeleton
                                                variant='circular'
                                                width={40}
                                                height={40}
                                            />
                                        </div>
                                        <div style={{ marginLeft: "10px" }}>
                                            <Skeleton
                                                variant='text'
                                                sx={{ fontSize: "15px", width: "120px" }}
                                            />
                                            <Skeleton
                                                variant='text'
                                                sx={{ fontSize: "10px", width: "90px" }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", marginBottom: "20px" }}>
                                        <div>
                                            <Skeleton
                                                variant='circular'
                                                width={40}
                                                height={40}
                                            />
                                        </div>
                                        <div style={{ marginLeft: "10px" }}>
                                            <Skeleton
                                                variant='text'
                                                sx={{ fontSize: "15px", width: "120px" }}
                                            />
                                            <Skeleton
                                                variant='text'
                                                sx={{ fontSize: "10px", width: "90px" }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", marginBottom: "20px" }}>
                                        <div>
                                            <Skeleton
                                                variant='circular'
                                                width={40}
                                                height={40}
                                            />
                                        </div>
                                        <div style={{ marginLeft: "10px" }}>
                                            <Skeleton
                                                variant='text'
                                                sx={{ fontSize: "15px", width: "120px" }}
                                            />
                                            <Skeleton
                                                variant='text'
                                                sx={{ fontSize: "10px", width: "90px" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                SuggestdAccounts.map((user, index) => (
                                    <AccountItem
                                        onMouseEnter={() => handleHover(user, index)}
                                        onMouseLeave={handleLeave}
                                        bold
                                        smdes
                                        userInfor={user}
                                        key={index}
                                    />
                                ))
                            )}

                            {isShowPopUp &&
                                (Profile.index === -1 || (
                                    <TopPosition.Provider
                                        value={{
                                            top: `${(Profile.index + 1) * 57}px`,
                                            onMouseLeave: handleProfileLeave,
                                            onMouseEnter: handleProfileEnter,
                                        }}
                                    >
                                        <ProfilePopover
                                            className={cn("profile-popover")}
                                            userInfor={Profile.user}
                                        />
                                    </TopPosition.Provider>
                                ))}
                        </div>
                    </Sidebar_DivSecondary>
                )}

                {followingAccounts && (
                    <Sidebar_DivSecondary
                        title='Following accounts'
                        seeall={SuggestdAccounts.length >= 5}
                    >
                        {!isGetAPIFollowingDone ? (
                            <div>
                                <div style={{ display: "flex", marginBottom: "20px" }}>
                                    <div>
                                        <Skeleton
                                            variant='circular'
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div style={{ marginLeft: "10px" }}>
                                        <Skeleton
                                            variant='text'
                                            sx={{ fontSize: "15px", width: "120px" }}
                                        />
                                        <Skeleton
                                            variant='text'
                                            sx={{ fontSize: "10px", width: "90px" }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "flex", marginBottom: "20px" }}>
                                    <div>
                                        <Skeleton
                                            variant='circular'
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div style={{ marginLeft: "10px" }}>
                                        <Skeleton
                                            variant='text'
                                            sx={{ fontSize: "15px", width: "120px" }}
                                        />
                                        <Skeleton
                                            variant='text'
                                            sx={{ fontSize: "10px", width: "90px" }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "flex", marginBottom: "20px" }}>
                                    <div>
                                        <Skeleton
                                            variant='circular'
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div style={{ marginLeft: "10px" }}>
                                        <Skeleton
                                            variant='text'
                                            sx={{ fontSize: "15px", width: "120px" }}
                                        />
                                        <Skeleton
                                            variant='text'
                                            sx={{ fontSize: "10px", width: "90px" }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "flex", marginBottom: "20px" }}>
                                    <div>
                                        <Skeleton
                                            variant='circular'
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div style={{ marginLeft: "10px" }}>
                                        <Skeleton
                                            variant='text'
                                            sx={{ fontSize: "15px", width: "120px" }}
                                        />
                                        <Skeleton
                                            variant='text'
                                            sx={{ fontSize: "10px", width: "90px" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : FollowingAccounts.length === 0 ? (
                            <div className={cn("none-user-found")}>
                                <img
                                    src={no_following}
                                    alt=''
                                />
                                <h4>Let's start follow someone</h4>
                                <h5>Following someone to see newest moments from them</h5>
                            </div>
                        ) : (
                            FollowingAccounts.map((user, index) => (
                                <AccountItem
                                    bold
                                    smdes
                                    userInfor={user}
                                    key={index}
                                />
                            ))
                        )}
                    </Sidebar_DivSecondary>
                )}

                <Sidebar_DivSecondary title='Discover'>
                    <div className={cn("tag")}>
                        {DICOVER_SECTION.map(({ title, icon }, index) => (
                            <Button
                                key={index}
                                outline
                                leftIcon={icon}
                                className={cn("tag-btn")}
                            >
                                <p className={cn("text-hidden-overflow")}>{title}</p>
                            </Button>
                        ))}
                    </div>
                </Sidebar_DivSecondary>

                <Sidebar_DivSecondary>
                    <Sidebar_Footer />
                </Sidebar_DivSecondary>
            </aside>
        </div>
    );
}

export default Sidebar;
