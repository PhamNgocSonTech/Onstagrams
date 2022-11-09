import classNames from "classnames/bind";
import styles from "./PostInfor.module.scss";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ImageList, ImageListItem, Skeleton } from "@mui/material";
import moment from "moment";

import Button from "../../components/common/Button";
import Comment from "../Comment";

import black_heart from "../../assets/image/content/black_heart.svg";
import pink_heart from "../../assets/image/content/pink_heart.svg";
import comment from "../../assets/image/content/comment.svg";
import share from "../../assets/image/content/share.svg";

import { useSelector } from "react-redux";
import Login from "../Login";
import { getUserById } from "../../utils/HttpRequest/user_request";

import FrameRecommendVideo from "../common/FrameRecommendVideo";

const cn = classNames.bind(styles);

function PostInfor({ postData = {} }) {
    const [isUnderlineUsername, setIsUnderlineUsername] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const [isFollow, setIsFollow] = useState(false);
    const [isShowPanel, setIsShowPanel] = useState(false);
    const [dataUser, setDataUser] = useState({});

    const [isGetAPIDone, setIsGetAPIDone] = useState(false);

    useEffect(() => {
        getUserById(postData.userId).then((user) => {
            setDataUser(user.data);
            setIsGetAPIDone(true);
        });
    }, []);

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
            {isGetAPIDone ? (
                <img
                    className={cn("avatar")}
                    alt='avt'
                    src={dataUser.avatar}
                    onMouseEnter={handleMouseHoverAvt}
                    onMouseLeave={handleMouseLeaveAvt}
                />
            ) : (
                <Skeleton
                    className={cn("avatar")}
                    variant={"rounded"}
                />
            )}

            <div className={cn("details")}>
                <div className={cn("author")}>
                    {isGetAPIDone ? (
                        <>
                            <h3
                                className={cn("username", {
                                    active: isUnderlineUsername,
                                })}
                            >
                                {dataUser.username}
                            </h3>
                            <h4
                                className={cn("name")}
                                onMouseEnter={handleMouseHoverAvt}
                                onMouseLeave={handleMouseLeaveAvt}
                            >
                                {dataUser.fullname}
                            </h4>
                            <span className={cn("time")}>- {moment(postData.createdAt).startOf("hour").fromNow()}</span>
                        </>
                    ) : (
                        <div>
                            <Skeleton
                                variant='text'
                                style={{ width: "300px" }}
                            />
                            <Skeleton
                                variant='text'
                                style={{ width: "200px" }}
                            />
                        </div>
                    )}
                </div>
                <div className={cn("video-des")}>
                    {isGetAPIDone ? (
                        <>
                            {" "}
                            <span className={cn("cap")}>{postData.desc} </span>
                            {postData.hashtag &&
                                postData.hashtag
                                    .split(" ")
                                    .map((ht, index) => <Button className={cn("hashtag")}>{ht}</Button>)}
                            {/* <Button className={cn("hashtag")}>#tinhyeu</Button>
                        <Button className={cn("hashtag")}>#tamtrang</Button>
                        <Button className={cn("hashtag")}>#tinhyeu</Button> */}
                        </>
                    ) : (
                        <>
                            {" "}
                            <Skeleton
                                variant='text'
                                style={{ height: "50px" }}
                            />
                        </>
                    )}
                </div>
                {isGetAPIDone ? (
                    <div className={cn("video-container")}>
                        {/* 1 image */}
                        {postData.img.length === 1 && (
                            <ImageList
                                variant='quilted'
                                sx={{ height: "100%", overflow: "hidden", padding: "20px" }}
                                cols={1}
                                className={cn("img-list")}
                            >
                                <ImageListItem>
                                    <img
                                        className={cn("video")}
                                        src={postData.img[0].url}
                                    />
                                </ImageListItem>
                            </ImageList>
                        )}

                        {/* 2, 4 image */}
                        {(postData.img.length == 2 || postData.img.length == 4) && (
                            <ImageList
                                variant='quilted'
                                sx={{ height: "100%", overflow: "hidden", padding: "15px" }}
                                cols={2}
                                gap={15}
                                className={cn("img-list")}
                            >
                                {postData.img.map((image, key) => (
                                    <ImageListItem key={key}>
                                        <img
                                            className={cn("video")}
                                            src={image.url}
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        )}

                        {/* 3 image */}
                        {postData.img.length === 3 && (
                            <div className={cn("three-frames-image")}>
                                <div className={cn("first-img")}>
                                    <img
                                        className={cn("video")}
                                        src={postData.img[0].url}
                                    />
                                </div>
                                <div className={cn("other-img")}>
                                    <img
                                        className={cn("video")}
                                        src={postData.img[1].url}
                                    />
                                    <img
                                        className={cn("video")}
                                        src={postData.img[2].url}
                                    />
                                </div>
                            </div>
                        )}

                        {/* > 4 image */}
                        {postData.img.length > 4 && (
                            <ImageList
                                variant='quilted'
                                sx={{ height: "100%", overflow: "hidden", padding: "15px" }}
                                cols={2}
                                gap={15}
                                className={cn("img-list")}
                            >
                                {postData.img.slice(0, 3).map((image, index) => (
                                    <ImageListItem key={index}>
                                        <img
                                            className={cn("video")}
                                            src={image.url}
                                        />
                                    </ImageListItem>
                                ))}
                                <ImageListItem className={cn("last-imgs")}>
                                    <img
                                        className={cn("video")}
                                        src={postData.img[4].url}
                                    />
                                    <div className={cn("excess-img")}>
                                        <h1>+{postData.img.length - 4}</h1>
                                    </div>
                                </ImageListItem>
                            </ImageList>
                        )}

                        {/* <ImageList
                        variant='quilted'
                        sx={{ height: "100%", overflow: "hidden", padding: "15px" }}
                        cols={2}
                        gap={15}
                        className={cn("img-list")}
                    >
                        <ImageListItem>
                            <img
                                className={cn("video")}
                                src={
                                    "http://res.cloudinary.com/doapkbncj/image/upload/v1667930671/onstagram_v2/posts/jubaj5wnls13z8o1blyk.jpg"
                                }
                            />
                        </ImageListItem>
                        <ImageListItem>
                            <img
                                className={cn("video")}
                                src={
                                    "http://res.cloudinary.com/doapkbncj/image/upload/v1667930671/onstagram_v2/posts/jubaj5wnls13z8o1blyk.jpg"
                                }
                            />
                        </ImageListItem>
                        <ImageListItem>
                            <img
                                className={cn("video")}
                                src={
                                    "http://res.cloudinary.com/doapkbncj/image/upload/v1667930671/onstagram_v2/posts/jubaj5wnls13z8o1blyk.jpg"
                                }
                            />
                        </ImageListItem>

                        <ImageListItem className={cn("last-imgs")}>
                            <img
                                className={cn("video")}
                                src={
                                    "http://res.cloudinary.com/doapkbncj/image/upload/v1667930671/onstagram_v2/posts/jubaj5wnls13z8o1blyk.jpg"
                                }
                            />
                            <div className={cn("excess-img")}>
                                <h1>+12</h1>
                            </div>
                        </ImageListItem>
                    </ImageList> */}

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
                                <span className={cn("act-text")}>{postData.likes.length}</span>
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
                                <span className={cn("act-text")}>{postData.comments.length}</span>
                            </div>
                            <div className={cn("action")}>
                                <div className={cn("act-btn")}>
                                    <img
                                        alt='img'
                                        src={share}
                                    />
                                </div>
                                <span className={cn("act-text")}>0</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Skeleton style={{ width: "600px", height: "600px", marginTop: "-120px" }} />
                )}
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
