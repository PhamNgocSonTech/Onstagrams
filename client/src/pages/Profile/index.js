import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { addProfileTags, PROFILE_TABS } from "../../Default/constant";
import { getUserById } from "../../utils/HttpRequest/user_request";
import { getPostByIdUser } from "../../utils/HttpRequest/post_request";

import Button from "../../components/common/Button";
import edit from "../../assets/image/profile/edit.svg";
import share from "../../assets/image/profile/share.svg";
import link from "../../assets/image/profile/link.svg";
import follow from "../../assets/image/profile/follow.svg";

import Tooltip from "../../components/common/Tooltip";
import EditProfile from "../../components/EditProfile";
import jwt_decode from "jwt-decode";

import { useRef } from "react";

const cn = classNames.bind(styles);

function Profile() {
    const [user, setUser] = useState({ followers: [], followings: [] });
    const [src, setSrc] = useState({ img: [], video: [] });
    const { id } = useParams();

    useEffect(() => {
        console.log(id);
        const getUser = (id) => {
            return getUserById(id).then((user) => user);
        };
        const getImageAndVideo = (id) => {
            return getPostByIdUser(id).then((src) => src);
        };

        if (id === "MyProfile") {
            // My Profile
            const token = window.localStorage.getItem("accessToken");
            try {
                const decode = jwt_decode(token);
                getUser(decode._id).then((user) => {
                    setUser(user.data);
                });
                getImageAndVideo(decode._id).then((src) => {
                    src.length > 0 && setSrc(src[0]);
                });
            } catch (Ex) {}
        } else {
            // Another Profile
            getUser(id).then((user) => {
                setUser(user.data);
            });
            getImageAndVideo(id).then((src) => {
                src.length > 0 && setSrc(src[0]);
            });
        }
    }, []);
    const [tabChoose, setTabChoose] = useState(0);
    // 1: My profile
    // 0: Another person profile
    const [viewType, setViewType] = useState(false);
    const [isFollow, setIsFollow] = useState(false);

    const [isOpenEditPopUp, setIsOpenEditPopUp] = useState(false);

    var Frame, contents;
    if (tabChoose === 0) {
        // Image
        Frame = addProfileTags(src.img)[0].frame;
        contents = addProfileTags(src.img)[0].contents;
    }

    if (tabChoose === 1) {
        // Video
        Frame = addProfileTags(src.video)[1].frame;
        contents = addProfileTags(src.video)[1].contents;
    }

    if (tabChoose === 2) {
        // Shared
        Frame = addProfileTags(src)[2].frame;
        contents = addProfileTags(src)[2].contents;
    }

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
                            src={user.avatar}
                            alt=''
                        />
                        <div className={cn("name")}>
                            <h2>{user.username}</h2>
                            <h5>{user.fullname}</h5>

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
                                <span className={cn("bold")}>{user.followings.length}</span>Following
                            </span>
                            <span className={cn("follow")}>
                                <span className={cn("bold")}>{user.followers.length}</span>Followers
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
                    {addProfileTags(src).map((tab, index) =>
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

                <div className={cn("content")}>{<Frame contents={contents} />}</div>
            </div>

            {/* Edit PopUp */}
            {isOpenEditPopUp && <EditProfile setIsOpenEditPopUp={setIsOpenEditPopUp} />}
        </div>
    );
}

export default Profile;
