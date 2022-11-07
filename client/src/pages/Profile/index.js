import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getListSrcFromAllPosts } from "../../utils/GetListSource/getListSrcFromAllPosts";

import { addProfileTags } from "../../Default/constant";
import { getUserById, followUserHasId, unfollowUserHasId } from "../../utils/HttpRequest/user_request";
import { getPostByIdUser } from "../../utils/HttpRequest/post_request";

import Popover from "../../components/common/Popover";
import VerifyAccount from "../../components/VerifyAccount";
import Button from "../../components/common/Button";
import edit from "../../assets/image/profile/edit.svg";
import share from "../../assets/image/profile/share.svg";
import link from "../../assets/image/profile/link.svg";
import follow from "../../assets/image/profile/follow.svg";
import friend from "../../assets/image/profile/friend.svg";
import not_auth from "../../assets/image/profile/not_auth.svg";
import veriyfed from "../../assets/image/verify/verifyed.svg";

import Tooltip from "../../components/common/Tooltip";
import EditProfile from "../../components/EditProfile";
import Login from "../../components/Login";
import jwt_decode from "jwt-decode";
import { Skeleton } from "@mui/material";

const cn = classNames.bind(styles);

function Profile() {
    const [isGetAPIDone, setIsGetAPIDone] = useState(false);
    const [user, setUser] = useState({ followers: [], followings: [] });
    const [src, setSrc] = useState({ img: [], video: [] });
    const [isShowVerifyPopUp, setIsShowVerifyPopUp] = useState(false);
    const [isShowVeryfyForm, setIsShowVeryfyForm] = useState(false);
    const [isShowLogin, setisShowLogin] = useState(false);
    const { id } = useParams();
    const idTimmer = useRef();
    // 1: My profile
    // 0: Another person profile
    const [viewType, setViewType] = useState(false);
    const [isFollow, setIsFollow] = useState(false);
    const [isFollowEachOther, setIsFollowEachOther] = useState(false);
    const [followerNum, setFollowerNum] = useState(0);
    const [followingNum, setFollowingNum] = useState(0);

    const handleVerify = () => {
        setIsShowVeryfyForm(true);
    };

    useEffect(() => {
        const getUser = (id) => {
            return getUserById(id).then((user) => user);
        };
        const getImageAndVideo = (id) => {
            return getPostByIdUser(id).then((src) => src);
        };

        // token => parse => id

        const token = window.localStorage.getItem("accessToken");
        try {
            const decode = jwt_decode(token); // => If OK => My View
            decode._id === id ? setViewType(true) : setViewType(false);
        } catch (Ex) {}

        getUser(id).then((user) => {
            setUser(user.data);
            if (token) {
                // Logged in => Check you follow this person or not
                const myid = jwt_decode(token); // This is my id
                user.data.followers.includes(myid._id) ? setIsFollow(true) : setIsFollow(false);
                user.data.followers.includes(myid._id) && user.data.followings.includes(myid._id)
                    ? setIsFollowEachOther(true)
                    : setIsFollowEachOther(false);
            }
            setFollowerNum(user.data.followers.length);
            setFollowingNum(user.data.followings.length);
        });
        getImageAndVideo(id).then((src) => {
            console.log(src);
            src.length > 0 ? setSrc(getListSrcFromAllPosts(src)) : setSrc([]);
            setIsGetAPIDone(true);
        });
    }, [id]);
    const [tabChoose, setTabChoose] = useState(0);

    const [isOpenEditPopUp, setIsOpenEditPopUp] = useState(false);

    var Frame, contents;
    if (tabChoose === 0) {
        // Image
        Frame = addProfileTags(src.img, src.video)[0].frame;
        contents = addProfileTags(src.img, src.video)[0].contents;
    }

    if (tabChoose === 1) {
        // Video
        Frame = addProfileTags(src.img, src.video)[1].frame;
        contents = addProfileTags(src.img, src.video)[1].contents;
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
        const token = window.localStorage.getItem("accessToken");

        if (token) {
            // You are logged in
            const myid = jwt_decode(token); // This is my id
            followUserHasId(user._id, token).then((res) => {
                if (res.status === 200) {
                    setIsFollow(true);
                    setFollowerNum((oldFl) => ++oldFl);
                    if (user.followings.includes(myid._id)) {
                        setIsFollowEachOther(true);
                    }
                }
            });
        } else {
            // You are not logged in => Must loggin first
            setisShowLogin(true);
        }
    };

    const handleUnfollowAccount = () => {
        const token = window.localStorage.getItem("accessToken");
        unfollowUserHasId(user._id, token).then((res) => {
            if (res.status === 200) {
                setFollowerNum((oldFl) => --oldFl);
                setIsFollow(false);
            }
        });
    };

    const handleShareAccount = () => {};

    const handleOpenEditPopUp = () => {
        setIsOpenEditPopUp(true);
    };

    const handleLeaveVerify = () => {
        idTimmer.current = setTimeout(() => {
            setIsShowVerifyPopUp(false);
        }, 700);
    };

    const handleEnterAgain = () => {
        clearTimeout(idTimmer.current);
    };

    return (
        <div className={cn("wrapper")}>
            {isShowLogin && <Login handleClosePanel={setisShowLogin} />}
            <div className={cn("user-infor")}>
                <div className={cn("infor-section")}>
                    <div className={cn("name-infor")}>
                        {!isGetAPIDone ? (
                            <Skeleton
                                variant='circular'
                                width={116}
                                height={116}
                            />
                        ) : (
                            <img
                                className={cn("avatar")}
                                src={user.avatar}
                                alt=''
                            />
                        )}

                        <div className={cn("name")}>
                            {!isGetAPIDone ? (
                                <div>
                                    <Skeleton
                                        variant='text'
                                        sx={{ fontSize: "35px", width: "350px", marginBottom: "-10px" }}
                                    />
                                    <Skeleton
                                        variant='text'
                                        sx={{ fontSize: "20px", width: "200px" }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <h2>{user.username}</h2>
                                    <h5>{user.fullname}</h5>
                                </>
                            )}

                            {viewType ? (
                                <div className={cn("ed")}>
                                    {!isGetAPIDone ? (
                                        <Skeleton
                                            variant='rounded'
                                            width={250}
                                            height={40}
                                        />
                                    ) : (
                                        <Button
                                            leftIcon={edit}
                                            outline
                                            className={cn("edit-profile-button")}
                                            onClick={handleOpenEditPopUp}
                                        >
                                            Edit profile
                                        </Button>
                                    )}
                                    {!user.verifed ? (
                                        <div
                                            className={cn("auth")}
                                            onMouseEnter={() => setIsShowVerifyPopUp(true)}
                                            onMouseLeave={handleLeaveVerify}
                                        >
                                            {!isGetAPIDone ? (
                                                <Skeleton
                                                    variant='rounded'
                                                    width={16}
                                                    height={16}
                                                />
                                            ) : (
                                                <img src={not_auth} />
                                            )}

                                            {isShowVerifyPopUp && (
                                                <div onMouseEnter={handleEnterAgain}>
                                                    <Popover className={cn("pop-up-auth")}>
                                                        <p>
                                                            Your account isn't verified.{" "}
                                                            <strong onClick={handleVerify}>Verify now !</strong>
                                                        </p>
                                                    </Popover>
                                                </div>
                                            )}
                                            {isShowVeryfyForm && (
                                                <VerifyAccount
                                                    email={user.email}
                                                    id={user._id}
                                                    setIsShowForm={setIsShowVeryfyForm}
                                                    setHandlePopup={setIsShowVerifyPopUp}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <div
                                            className={cn("auth")}
                                            onMouseEnter={() => setIsShowVerifyPopUp(true)}
                                            onMouseLeave={handleLeaveVerify}
                                        >
                                            <img src={veriyfed} />

                                            {isShowVerifyPopUp && (
                                                <div onMouseEnter={handleEnterAgain}>
                                                    <Popover className={cn("pop-up-auth")}>
                                                        <p>
                                                            Your account{" "}
                                                            <strong style={{ color: "green" }}>
                                                                has been verifyed
                                                            </strong>{" "}
                                                            by Onstagrams
                                                        </p>
                                                    </Popover>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
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
                                            src={isFollowEachOther ? friend : follow} // follow hand
                                            alt='follow'
                                        />
                                        <div className={cn("unfollow-tooltip")}>
                                            <Tooltip>Unfollow</Tooltip>
                                        </div>
                                    </div>
                                </div>
                            ) : !isGetAPIDone ? (
                                <Skeleton
                                    variant='rounded'
                                    width={250}
                                    height={40}
                                />
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
                        {!isGetAPIDone ? (
                            <div>
                                <Skeleton
                                    variant='text'
                                    sx={{ fontSize: "20px", width: "300px" }}
                                />
                            </div>
                        ) : (
                            <div className={cn("follow-infor")}>
                                <span className={cn("follow")}>
                                    <span className={cn("bold")}>{followingNum}</span>Following
                                </span>
                                <span className={cn("follow")}>
                                    <span className={cn("bold")}>{followerNum}</span>Followers
                                </span>
                                <span className={cn("follow")}>
                                    <span className={cn("bold")}>0</span>Likes
                                </span>
                            </div>
                        )}

                        <div className={cn("bio")}>
                            <p>{user.bio}</p>
                        </div>
                    </div>
                    {user.external && (
                        <div className={cn("share-link")}>
                            <Button
                                leftIcon={link}
                                href={user.external}
                                className={cn("button-link")}
                            >
                                {user.external}
                            </Button>
                        </div>
                    )}
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

                <div className={cn("content")}>
                    {!isGetAPIDone ? (
                        <div>
                            <Skeleton
                                variant='rounded'
                                width={182}
                                height={200}
                            />
                        </div>
                    ) : (
                        <Frame
                            contents={contents}
                            isMyProfile={viewType}
                        />
                    )}
                </div>
            </div>

            {/* Edit PopUp */}
            {isOpenEditPopUp && <EditProfile setIsOpenEditPopUp={setIsOpenEditPopUp} />}
        </div>
    );
}

export default Profile;
