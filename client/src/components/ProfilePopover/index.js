import classNames from "classnames/bind";

import styles from "./ProfilePopover.module.scss";
import Popover from "../common/Popover";
import Button from "../common/Button";

import { convert_milions } from "../../Default/constant";

import check from "../../assets/image/header/check.svg";
import { useNavigate } from "react-router-dom";

const cn = classNames.bind(styles);

function ProfilePopover({ className, userInfor }) {
    const navigate = useNavigate();
    function handleNegativeToProfile(id) {
        navigate(`/profile/${id}`);
    }
    return (
        <Popover className={cn("wrapper", { [className]: className })}>
            <div className={cn("header")}>
                <img
                    className={cn("avt")}
                    alt='img'
                    src={userInfor.avatar}
                    onClick={() => handleNegativeToProfile(userInfor._id)}
                />
                <Button
                    className={cn("follow")}
                    primary
                >
                    Follow
                </Button>
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
                <span className={cn("num")}>{convert_milions(userInfor.followers.length)}</span>
                <span className={cn("label")}>Followers</span>
                <span className={cn("num")}>{convert_milions(userInfor.followings.length)}</span>
                <span className={cn("label")}>Followings</span>
            </div>
        </Popover>
    );
}

export default ProfilePopover;
