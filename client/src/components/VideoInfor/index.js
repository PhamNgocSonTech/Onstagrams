import classNames from "classnames/bind";
import styles from "./VideoInfor.module.scss";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSelector } from "react-redux";

import FrameRecommendVideo from "../../components/common/FrameRecommendVideo";
import Button from "../../components/common/Button";

import music from "../../assets/image/sidebar/music.svg";
import black_heart from "../../assets/image/content/black_heart.svg";
import pink_heart from "../../assets/image/content/pink_heart.svg";
import comment from "../../assets/image/content/comment.svg";
import share from "../../assets/image/content/share.svg";

import Login from "../Login";
import Comment from "../Comment";

const cn = classNames.bind(styles);

function VideoInfor() {
    const [isUnderlineUsername, setIsUnderlineUsername] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const [isFollow, setIsFollow] = useState(false);
    const [isShowPanel, setIsShowPanel] = useState(false);

    const didLogin = useSelector((state) => state.loginState_reducer.user);

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
                src='https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/01d8d4475876db565c7990edf21443e8~c5_100x100.jpeg?x-expires=1666807200&x-signature=CRSAI21L0yFB6t8%2Foz59CZb6stI%3D'
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
                        thanlanoscarr
                    </h3>
                    <h4
                        className={cn("name")}
                        onMouseEnter={handleMouseHoverAvt}
                        onMouseLeave={handleMouseLeaveAvt}
                    >
                        𝓣𝓪̀𝓲❤️𝓦𝓲𝓷𝓽𝓮𝓪𝓶
                    </h4>
                </div>
                <div className={cn("video-des")}>
                    <span className={cn("cap")}>Huyền thoại vẫn luôn cháy như thế... {"  "}</span>
                    <Button className={cn("hashtag")}>#lyrics</Button>
                    <Button className={cn("hashtag")}>#giacmocothat</Button>
                    <Button className={cn("hashtag")}>#nhachaymoingay</Button>
                    <Button className={cn("hashtag")}>#tinhyeu</Button>
                    <Button className={cn("hashtag")}>#tamtrang</Button>
                    <Button className={cn("hashtag")}>#tinhyeu</Button>
                    <Button className={cn("hashtag")}>#voiceeffectsforyou</Button>
                </div>
                <Button
                    className={cn("hashtag", "music")}
                    leftIcon={music}
                >
                    Timber LHT - 𝐿𝑒 𝐻𝑢𝑦𝑒𝑛 𝑇𝑟𝑎𝑛𝑔🐰
                </Button>
                <div className={cn("video-container")}>
                    <video
                        className={cn("video")}
                        controls
                        src='https://v16-webapp.tiktok.com/f6893ffa9d54e4c02115ea7acd365121/635ad5a5/video/tos/useast2a/tos-useast2a-pve-0037-aiso/56ae13d4966b4b178a5593a2ad329ac8/?a=1988&ch=0&cr=0&dr=0&lr=tiktok&cd=0%7C0%7C1%7C0&cv=1&br=2132&bt=1066&cs=0&ds=3&ft=kLO5qy-gZmo0Pq~-EBkVQzF.DiHKJdmC0&mime_type=video_mp4&qs=0&rc=ODc4Nzw2ZTkzPDU6ODxlN0BpajNteGk6ZnA2ZzMzZjgzM0AtMGNiLzAtXzUxYy5gMWEvYSMuLm02cjRnajBgLS1kL2Nzcw%3D%3D&l=2022102713010401024407506025081EE3&btag=80000'
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

export default VideoInfor;
