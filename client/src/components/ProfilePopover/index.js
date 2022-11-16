import classNames from "classnames/bind";

import styles from "./ProfilePopover.module.scss";
import Popover from "../common/Popover";
import Button from "../common/Button";

import { convert_milions } from "../../Default/constant";

import check from "../../assets/image/header/check.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { checkExpiredToken } from "../../utils/CheckExpiredToken/checkExpiredToken";
import { refreshToken } from "../../utils/HttpRequest/auth_request";
import { followUserHasId, unfollowUserHasId } from "../../utils/HttpRequest/user_request";

const cn = classNames.bind(styles);

function ProfilePopover({ className, userInfor, showLoginForm, funcRefresh }) {
    const navigate = useNavigate();
    const [hasFollow, setHasFollow] = useState(() => {
        const token = window.localStorage.getItem("accessToken");
        let stt = false;
        if (token) {
            const myid = jwt_decode(token)._id;
            const filterFlwing = userInfor.followers.filter((user) => user === myid);
            if (filterFlwing.length > 0) {
                stt = true;
            }
        }
        return stt;
    });
    const [followersNum, setFollowersNum] = useState(userInfor.followers.length);
    const [followingsNum, setFollowingsNum] = useState(userInfor.followings.length);
    function handleNegativeToProfile(id) {
        navigate(`/profile/${id}`);
    }

    const handleChangeFollowState = async () => {
        let token = window.localStorage.getItem("accessToken");

        if (token) {
            if (checkExpiredToken(token)) {
                // Expired token
                const rt = window.localStorage.getItem("refreshToken");
                await refreshToken(rt).then((newat) => {
                    token = newat.data.accessToken;
                    window.localStorage.setItem("accessToken", newat.data.accessToken);
                });
            }

            if (hasFollow) {
                // Handle Unfollow
                unfollowUserHasId(userInfor._id, token).then((res) => {
                    if (res.status === 200 || res.status === 304) {
                        setHasFollow(false);
                        setFollowersNum((pre) => --pre);
                        funcRefresh();
                    }
                });
            } else {
                // Handle Follow
                followUserHasId(userInfor._id, token).then((res) => {
                    if (res.status === 200 || res.status === 304) {
                        setHasFollow(true);
                        setFollowersNum((pre) => ++pre);
                        funcRefresh();
                    }
                });
            }
        } else {
            showLoginForm(true);
        }
    };

    return (
        <Popover className={cn("wrapper", { [className]: className })}>
            <div className={cn("header")}>
                <img
                    className={cn("avt")}
                    alt='img'
                    src={userInfor.avatar}
                    onClick={() => handleNegativeToProfile(userInfor._id)}
                />
                {hasFollow ? (
                    <Button
                        outline
                        className={cn("follow")}
                        onClick={handleChangeFollowState}
                    >
                        Following
                    </Button>
                ) : (
                    <Button
                        className={cn("follow")}
                        primary
                        onClick={handleChangeFollowState}
                    >
                        Follow
                    </Button>
                )}
            </div>
            <Button
                className={cn("username")}
                onClick={() => handleNegativeToProfile(userInfor._id)}
            >
                {userInfor.username}
                {userInfor.followers.length >= 5 && (
                    <img
                        className={cn("check")}
                        src={check}
                        alt='img'
                    />
                )}
            </Button>
            <p
                className={cn("name")}
                onClick={() => handleNegativeToProfile(userInfor._id)}
            >
                {userInfor.fullname}
            </p>
            <div className={cn("number-des")}>
                <span className={cn("num")}>{convert_milions(followersNum)}</span>
                <span className={cn("label")}>Followers</span>
                <span className={cn("num")}>{convert_milions(followingsNum)}</span>
                <span className={cn("label")}>Followings</span>
            </div>
        </Popover>
    );
}

export default ProfilePopover;
