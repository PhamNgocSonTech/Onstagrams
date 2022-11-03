import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import { useState } from "react";
import { useSelector } from "react-redux";

import { PROFILE_TABS } from "../../Default/constant";

import Button from "../../components/common/Button";
import edit from "../../assets/image/profile/edit.svg";
import share from "../../assets/image/profile/share.svg";
import link from "../../assets/image/profile/link.svg";
import person from "../../assets/image/profile/person.svg";
import image from "../../assets/image/profile/image.svg";
import video from "../../assets/image/profile/video.svg";
import follow from "../../assets/image/profile/follow.svg";

import EmptyContent from "../../components/common/EmptyContent";
import PhotoGallery from "../../components/PhotoGallery";
import VideoGallery from "../../components/VideoGallery";
import Tooltip from "../../components/common/Tooltip";
import EditProfile from "../../components/EditProfile";

import { useRef } from "react";

const cn = classNames.bind(styles);

function Profile() {
    const [tabChoose, setTabChoose] = useState(0);
    // 1: My profile
    // 0: Another person profile
    const [viewType, setViewType] = useState(false);
    const [isFollow, setIsFollow] = useState(false);

    const [isOpenEditPopUp, setIsOpenEditPopUp] = useState(false);

    const didLogin = useSelector((state) => state.loginState_reducer.user);

    const Content = PROFILE_TABS[tabChoose].content;

    const bar = useRef();

    const handleChangeTag = (index) => {
        setTabChoose(index);
    };

    const handleHoverTag = (index) => {
        bar.current.style.left = index * 230 + "px";
    };

    const handleLeaveTag = () => {
        bar.current.style.left = tabChoose * 230 + "px";
    };

    const handleFollowAccount = () => {
        setIsFollow(true);
    };

    const handleUnfollowAccount = () => {
        setIsFollow(false);
    };

    const handleShareAccount = () => {
        setViewType(!viewType);
    };

    const handleOpenEditPopUp = () => {
        setIsOpenEditPopUp(true);
    };

    return (
        <div className={cn("wrapper")}>
            <div className={cn("user-infor")}>
                <div className={cn("infor-section")}>
                    <div className={cn("name-infor")}>
                        <img
                            className={cn("avatar")}
                            src={didLogin.avatar}
                            alt=''
                        />
                        <div className={cn("name")}>
                            <h2>{didLogin.username}</h2>
                            <h5>{didLogin.fullname}</h5>

                            {viewType ? (
                                <Button
                                    leftIcon={edit}
                                    outline
                                    className={cn("edit-profile-button")}
                                    onClick={handleOpenEditPopUp}
                                >
                                    Edit profile
                                </Button>
                            ) : isFollow ? (
                                <div className={cn("message-section")}>
                                    <Button
                                        outlinePrimary
                                        className={cn("message-profile-button")}
                                    >
                                        Message
                                    </Button>
                                    <div
                                        className={cn("unfollow")}
                                        onClick={handleUnfollowAccount}
                                    >
                                        <img
                                            src={follow}
                                            alt='follow'
                                        />
                                        <div className={cn("unfollow-tooltip")}>
                                            <Tooltip>Unfollow</Tooltip>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    primary
                                    className={cn("follow-profile-button")}
                                    onClick={handleFollowAccount}
                                >
                                    Follow
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className={cn("bio-infor")}>
                        <div className={cn("follow-infor")}>
                            <span className={cn("follow")}>
                                <span className={cn("bold")}>16</span>Following
                            </span>
                            <span className={cn("follow")}>
                                <span className={cn("bold")}>6</span>Followers
                            </span>
                            <span className={cn("follow")}>
                                <span className={cn("bold")}>0</span>Likes
                            </span>
                        </div>
                        <div className={cn("bio")}>
                            <p>Contact: hc19082001@gmail.com</p>
                        </div>
                    </div>
                    <div className={cn("share-link")}>
                        <Button
                            leftIcon={link}
                            href='https://www.facebook.com/pz.hcnguyen.k1908'
                            className={cn("button-link")}
                        >
                            https://www.facebook.com/pz.hcnguyen.k1908
                        </Button>
                    </div>
                </div>
                <img
                    className={cn("share")}
                    src={share}
                    alt=''
                    onClick={handleShareAccount}
                />
            </div>
            <div className={cn("user-gallery")}>
                <div className={cn("tabs")}>
                    {PROFILE_TABS.map((tab, index) =>
                        tab.icon ? (
                            <div
                                key={index}
                                className={cn("tab-item", { highlight: index === tabChoose })}
                                onClick={() => handleChangeTag(index)}
                                onMouseEnter={() => handleHoverTag(index)}
                                onMouseLeave={handleLeaveTag}
                            >
                                <img
                                    src={tab.icon}
                                    alt='icon'
                                />
                                <p>{tab.name}</p>
                            </div>
                        ) : (
                            <div
                                key={index}
                                className={cn("tab-item", { highlight: index === tabChoose })}
                                onClick={() => handleChangeTag(index)}
                                onMouseEnter={() => handleHoverTag(index)}
                                onMouseLeave={handleLeaveTag}
                            >
                                <p>{tab.name}</p>
                            </div>
                        )
                    )}
                    <div
                        className={cn("bar")}
                        ref={bar}
                    ></div>
                </div>

                <div className={cn("content")}>{<Content />}</div>
            </div>

            {/* Edit PopUp */}
            {isOpenEditPopUp && <EditProfile setIsOpenEditPopUp={setIsOpenEditPopUp} />}
        </div>
    );
}

export default Profile;
