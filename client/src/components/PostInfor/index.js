import classNames from "classnames/bind";
import styles from "./PostInfor.module.scss";
import { useState } from "react";
import { motion } from "framer-motion";

import Button from "../../components/common/Button";
import Comment from "../Comment";

import black_heart from "../../assets/image/content/black_heart.svg";
import pink_heart from "../../assets/image/content/pink_heart.svg";
import comment from "../../assets/image/content/comment.svg";
import share from "../../assets/image/content/share.svg";

import { useSelector } from "react-redux";
import Login from "../Login";

import FrameRecommendVideo from "../common/FrameRecommendVideo";

const cn = classNames.bind(styles);

function PostInfor() {
    const [isUnderlineUsername, setIsUnderlineUsername] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const [isFollow, setIsFollow] = useState(false);
    const [isShowPanel, setIsShowPanel] = useState(false);

    const didLogin = useSelector((state) => state.loginState_reducer.isLogIn);

    const animations = {
        like: {
            scale: [1, 1.4, 0.8, 1],
        },
        dislike: {},
    };

    function handleMouseHoverAvt() {
        setIsUnderlineUsername(true);
    }

    function handleMouseLeaveAvt() {
        setIsUnderlineUsername(false);
    }

    function handleLike() {
        setIsLike(!isLike);
    }

    function handleChangeFollower() {
        setIsFollow(!isFollow);
    }

    function handleOpenCommentSection() {
        setIsShowPanel(true);
    }

    return (
        <FrameRecommendVideo className={cn("wrapper")}>
            <img
                className={cn("avatar")}
                alt='avt'
                src='https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/27090e4b6826f4471c40afb66771d5ce.jpeg?x-expires=1666843200&x-signature=ogQ00wzSeEyfEvRat%2Fm99FoZGZ4%3D'
                onMouseEnter={handleMouseHoverAvt}
                onMouseLeave={handleMouseLeaveAvt}
            />

            <div className={cn("details")}>
                <div className={cn("author")}>
                    <h3
                        className={cn("username", {
                            active: isUnderlineUsername,
                        })}
                    >
                        alex_mine
                    </h3>
                    <h4
                        className={cn("name")}
                        onMouseEnter={handleMouseHoverAvt}
                        onMouseLeave={handleMouseLeaveAvt}
                    >
                        ❤️
                    </h4>
                </div>
                <div className={cn("video-des")}>
                    <span className={cn("cap")}>
                        Bạn có đủ dũng cảm để tiếp tục tình yêu dù biết rằng sẽ không đem lại kết quả? 😂{" "}
                    </span>
                    <Button className={cn("hashtag")}>#sad</Button>
                    <Button className={cn("hashtag")}>#tinhyeu</Button>
                    <Button className={cn("hashtag")}>#tamtrang</Button>
                    <Button className={cn("hashtag")}>#tinhyeu</Button>
                </div>
                <div className={cn("video-container")}>
                    <img
                        className={cn("video")}
                        src='https://kenh14cdn.com/thumb_w/660/2020/6/23/a483bd33d4c46bf25bac64d11cdb04d8-159292559942978254085.jpg'
                    />
                    <div className={cn("actions")}>
                        <div className={cn("action")}>
                            <div
                                className={cn("act-btn")}
                                onClick={handleLike}
                            >
                                <motion.img
                                    alt='img'
                                    variants={animations}
                                    src={isLike ? pink_heart : black_heart}
                                    animate={isLike ? "like" : "dislike"}
                                />
                            </div>
                            <span className={cn("act-text")}>130K</span>
                        </div>
                        <div className={cn("action")}>
                            <div
                                className={cn("act-btn")}
                                onClick={handleOpenCommentSection}
                            >
                                <img
                                    alt='img'
                                    src={comment}
                                />
                            </div>
                            <span className={cn("act-text")}>2602</span>
                        </div>
                        <div className={cn("action")}>
                            <div className={cn("act-btn")}>
                                <img
                                    alt='img'
                                    src={share}
                                />
                            </div>
                            <span className={cn("act-text")}>20K</span>
                        </div>
                    </div>
                </div>
            </div>

            {isFollow ? (
                <Button
                    onClick={handleChangeFollower}
                    className={cn("following")}
                    outline
                >
                    <p className={cn("fling-text")}>Following</p>
                </Button>
            ) : (
                <Button
                    onClick={handleChangeFollower}
                    className={cn("follow")}
                    outline
                >
                    <p className={cn("fl-text")}>Follow</p>
                </Button>
            )}

            {/* Comment Section */}
            {isShowPanel &&
                (didLogin ? (
                    <Comment setIsShowComment={setIsShowPanel} />
                ) : (
                    <Login handleClosePanel={setIsShowPanel} />
                ))}
        </FrameRecommendVideo>
    );
}

export default PostInfor;
