/* eslint-disable react/jsx-pascal-case */
import classNames from "classnames/bind";
import AccountItem from "../../AccountItem";
import Button from "../Button";
import Sidebar_DivSecondary from "./Sidebar_FrameSecondary";
import MainBar from "./MainBar";
import styles from "./Sidebar.module.scss";

import { DICOVER_SECTION } from "../../../Default/constant";
import Sidebar_Footer from "./Sidebar_Footer";
import ProfilePopover from "../../ProfilePopover";
import { createContext, useEffect, useRef, useState } from "react";

import { getUsers } from "../../../utils/HttpRequest/user_request";

const cn = classNames.bind(styles);
export const TopPosition = createContext();

function Sidebar({
    className,
    isShowPopUp = true,
    followerAccounts = false,
    suggestAcounts = true,
    followingAccounts = true,
}) {
    const [SuggestdAccounts, setSuggestdAccounts] = useState([]);
    const [FollowingAccounts, setFollowingAccounts] = useState([]);
    const [FollowerAccounts, setFollowerAccounts] = useState([]);
    let idLeave = useRef();
    let idHover = useRef();

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

    useEffect(() => {
        Promise.all([
            getUsers("", {
                p: 1,
                l: 5,
                badge: true,
            }),
            getUsers("", {
                p: 1,
                l: 5,
                badge: false,
            }),
            getUsers("", {
                p: 1,
                l: 5,
                badge: true,
            }),
        ]).then(([SuggestedAcc, FollowingAcc, FollowerAcc]) => {
            setSuggestdAccounts(SuggestedAcc);
            setFollowingAccounts(FollowingAcc);
            setFollowerAccounts(FollowerAcc);
        });
    }, []);

    return (
        <aside
            className={cn("sidebar", { [className]: className })}
            onScroll={handleScrollSideBar}
        >
            <MainBar />

            {followerAccounts && (
                <Sidebar_DivSecondary
                    title='Follower accounts'
                    seeall
                >
                    {FollowerAccounts.map((user, index) => (
                        <AccountItem
                            bold
                            smdes
                            userInfor={user}
                            key={index}
                        />
                    ))}
                </Sidebar_DivSecondary>
            )}

            {suggestAcounts && (
                <Sidebar_DivSecondary
                    title='Suggested accounts'
                    seeall
                >
                    <div className={cn("container")}>
                        {SuggestdAccounts.map((user, index) => (
                            <AccountItem
                                onMouseEnter={() => handleHover(user, index)}
                                onMouseLeave={handleLeave}
                                bold
                                smdes
                                userInfor={user}
                                key={index}
                            />
                        ))}

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
                    seeall
                >
                    {FollowingAccounts.map((user, index) => (
                        <AccountItem
                            bold
                            smdes
                            userInfor={user}
                            key={index}
                        />
                    ))}
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
    );
}

export default Sidebar;
