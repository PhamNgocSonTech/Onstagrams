import classNames from "classnames/bind";
import styles from "./PostInfor.module.scss";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageList, ImageListItem, Skeleton } from "@mui/material";
import moment from "moment";

import Button from "../../components/common/Button";
import Comment from "../Comment";
import more from "../../assets/image/comment/more.svg";

import black_heart from "../../assets/image/content/black_heart.svg";
import pink_heart from "../../assets/image/content/pink_heart.svg";
import comment from "../../assets/image/content/comment.svg";
import share from "../../assets/image/content/share.svg";

import { useSelector } from "react-redux";
import Login from "../Login";
import { getUserById } from "../../utils/HttpRequest/user_request";

import FrameRecommendVideo from "../common/FrameRecommendVideo";
import Popover from "../common/Popover";
import Modal_Center from "../common/Modal/Modal_Center";
import jwt_decode from "jwt-decode";
import { deletePost } from "../../utils/HttpRequest/post_request";
import Toast from "../common/Toast";
import LoadingModal from "../common/LoadingModal";
import { useNavigate } from "react-router-dom";

const cn = classNames.bind(styles);

function PostInfor({ postData = {} }) {
    /** postData
     * 
     * {
    "_id": "636a9a2f41da11eaa44b1b19",
    "desc": "ÁDASD #conan",
    "img": [
        {   
            ...
            "url": "http://res.cloudinary.com/doapkbncj/image/upload/v1667930671/onstagram_v2/posts/jubaj5wnls13z8o1blyk.jpg",
            ...
        },
        {
            ...
            "url": "http://res.cloudinary.com/doapkbncj/image/upload/v1667930671/onstagram_v2/posts/fnlch4ujah75thna9kjw.jpg",
            ...

        },
        {
            ...
            "url": "http://res.cloudinary.com/doapkbncj/image/upload/v1667930671/onstagram_v2/posts/ynxmxrcy6rjslyhuoyir.jpg",
            ...
        }
    ],
    "video": [],
    "userId": "6367b61cf5189c410030d936",
    "likes": [],
    "comments": [],
    "createdAt": "2022-11-08T18:04:31.103Z",
    "updatedAt": "2022-11-08T18:04:31.103Z",
    "__v": 0
        }
     */
    const [isUnderlineUsername, setIsUnderlineUsername] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const [isFollow, setIsFollow] = useState(false);
    const [isShowPanel, setIsShowPanel] = useState(false);
    const [isShowComment, setIsShowComment] = useState({ isShow: false, data: {} });
    const [isMyAccount, setIsMyAccount] = useState(() => {
        const token = window.localStorage.getItem("accessToken");
        if (jwt_decode(token)._id === postData.userId) {
            return true;
        } else {
            return false;
        }
    });
    const [dataUser, setDataUser] = useState({});

    const [isOpenFormDelete, setIsOpenFormDelete] = useState(false);
    const [isOpenAcceptDeleteOption, setIsOpenAcceptDeleteOption] = useState(false);

    const [isGetAPIDone, setIsGetAPIDone] = useState(false);
    const [isShowToast, setIsShowToast] = useState({ isShow: false, type: false, message: "" });

    const [isShowLoadingModal, setIsShowLoadingModal] = useState(false);

    const negative = useNavigate();

    const ref = useRef();

    const handleOpenComment = (url) => {
        const dataToComment = [];
        postData.img.forEach((img) => {
            if (img.url === url) {
                dataToComment.push({
                    postID: postData._id,
                    url: img.url,
                    show: true,
                });
            } else {
                dataToComment.push({
                    postID: postData._id,
                    url: img.url,
                });
            }
        });
        setIsShowComment({ isShow: true, data: dataToComment });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpenAcceptDeleteOption(false);
            }
        };
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    useEffect(() => {
        getUserById(postData.userId).then((user) => {
            setDataUser(user.data);
            setIsGetAPIDone(true);
        });
    }, []);

    const didLogin = useSelector((state) => state.loginState_reducer.user);

    function handleDeletePost() {
        setIsShowLoadingModal(true);
        const token = window.localStorage.getItem("accessToken");
        deletePost(token, postData._id).then((res) => {
            setIsShowLoadingModal(false);
            if (res.status === 200 || res.status === 304) {
                setIsShowToast({ isShow: true, type: true, message: "Deleted successfully !" });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setIsShowToast({ isShow: true, type: false, message: res.data });
            }
        });
    }

    const animations = {
        like: {
            scale: [1, 1.4, 0.8, 1],
        },
        dislike: {},
    };

    function handleChangeToProfile(id) {
        negative(`/profile/${id}`);
    }

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
        //setIsShowPanel(true);
        const dataToComment = [];
        postData.img.forEach((img, index) => {
            if (index === 0) {
                dataToComment.push({
                    postID: postData._id,
                    url: img.url,
                    show: true,
                });
            } else {
                dataToComment.push({
                    postID: postData._id,
                    url: img.url,
                });
            }
        });
        setIsShowComment({ isShow: true, data: dataToComment });
    }

    return (
        <FrameRecommendVideo className={cn("wrapper")}>
            {isGetAPIDone ? (
                <img
                    className={cn("avatar")}
                    onClick={() => handleChangeToProfile(dataUser._id)}
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
                                onClick={() => handleChangeToProfile(dataUser._id)}
                            >
                                {dataUser.username}
                            </h3>
                            <h4
                                className={cn("name")}
                                onMouseEnter={handleMouseHoverAvt}
                                onMouseLeave={handleMouseLeaveAvt}
                                onClick={() => handleChangeToProfile(dataUser._id)}
                            >
                                {dataUser.fullname}
                            </h4>
                            <span className={cn("time")}>- {moment(postData.createdAt).fromNow()}</span>
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
                            <span className={cn("cap")}>{postData.desc} </span>
                            {postData.hashtag &&
                                postData.hashtag.split(" ").map((ht, index) => (
                                    <Button
                                        key={index}
                                        className={cn("hashtag")}
                                    >
                                        {ht}
                                    </Button>
                                ))}
                            {/* <Button className={cn("hashtag")}>#tinhyeu</Button>
                        <Button className={cn("hashtag")}>#tamtrang</Button>
                        <Button className={cn("hashtag")}>#tinhyeu</Button> */}
                        </>
                    ) : (
                        <>
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
                                sx={{ height: "100%", overflow: "hidden" }}
                                cols={1}
                                className={cn("img-list")}
                            >
                                <ImageListItem>
                                    <img
                                        className={cn("video")}
                                        src={postData.img[0].url}
                                        onClick={() => handleOpenComment(postData.img[0].url)}
                                    />
                                </ImageListItem>
                            </ImageList>
                        )}

                        {/* 2, 4 image */}
                        {(postData.img.length == 2 || postData.img.length == 4) && (
                            <ImageList
                                variant='quilted'
                                sx={{ height: "100%", overflow: "hidden" }}
                                cols={2}
                                gap={15}
                                className={cn("img-list")}
                            >
                                {postData.img.map((image, key) => (
                                    <ImageListItem key={key}>
                                        <img
                                            className={cn("video")}
                                            src={image.url}
                                            onClick={() => handleOpenComment(image.url)}
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
                                        onClick={() => handleOpenComment(postData.img[0].url)}
                                    />
                                </div>
                                <div className={cn("other-img")}>
                                    <img
                                        className={cn("video")}
                                        src={postData.img[1].url}
                                        onClick={() => handleOpenComment(postData.img[1].url)}
                                    />
                                    <img
                                        className={cn("video")}
                                        src={postData.img[2].url}
                                        onClick={() => handleOpenComment(postData.img[2].url)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* > 4 image */}
                        {postData.img.length > 4 && (
                            <ImageList
                                variant='quilted'
                                sx={{ height: "100%", overflow: "hidden" }}
                                cols={2}
                                gap={15}
                                className={cn("img-list")}
                            >
                                {postData.img.slice(0, 3).map((image, index) => (
                                    <ImageListItem key={index}>
                                        <img
                                            className={cn("video")}
                                            src={image.url}
                                            onClick={() => handleOpenComment(image.url)}
                                        />
                                    </ImageListItem>
                                ))}
                                <ImageListItem className={cn("last-imgs")}>
                                    <img
                                        className={cn("video")}
                                        src={postData.img[3].url}
                                    />
                                    <div
                                        className={cn("excess-img")}
                                        onClick={() => handleOpenComment(postData.img[3].url)}
                                    >
                                        <h1>+{postData.img.length - 4}</h1>
                                    </div>
                                </ImageListItem>
                            </ImageList>
                        )}

                        <div className={cn("actions")}>
                            <div className={cn("action")}>
                                <div
                                    className={cn("act-btn")}
                                    onClick={handleLike}
                                >
                                    <motion.img
                                        alt='img'
                                        variants={animations}
                                        whileHover={{ rotate: ["0", "-45deg", "45deg", "0deg"] }}
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
                                    <motion.img
                                        alt='img'
                                        src={comment}
                                        whileHover={{ rotate: ["0", "-45deg", "45deg", "0deg"] }}
                                    />
                                </div>
                                <span className={cn("act-text")}>{postData.comments.length}</span>
                            </div>
                            <div className={cn("action")}>
                                <div className={cn("act-btn")}>
                                    <motion.img
                                        alt='img'
                                        src={share}
                                        whileHover={{ rotate: ["0", "-45deg", "45deg", "0deg"] }}
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

            {isMyAccount && (
                <>
                    <div
                        className={cn("more-btn")}
                        ref={ref}
                    >
                        <img
                            src={more}
                            alt=''
                            onClick={() => setIsOpenAcceptDeleteOption(!isOpenAcceptDeleteOption)}
                        />
                        {isOpenAcceptDeleteOption && (
                            <Popover className={cn("delete-post")}>
                                <Button
                                    outline
                                    className={cn("btn-option", "btn-2")}
                                    onClick={() => {
                                        setIsOpenAcceptDeleteOption(false);
                                        setIsOpenFormDelete(true);
                                    }}
                                >
                                    Delete this post
                                </Button>
                            </Popover>
                        )}
                        {isOpenFormDelete && (
                            <Modal_Center className={cn("accept-delete-form")}>
                                <h2>Are you sure to delete this post ? </h2>
                                <div className={cn("accept-btns")}>
                                    <Button
                                        className={cn("accept-btn")}
                                        outlinePrimary
                                        onClick={() => {
                                            setIsOpenFormDelete(false);
                                        }}
                                    >
                                        No
                                    </Button>
                                    <Button
                                        className={cn("accept-btn")}
                                        outlinePrimary
                                        onClick={handleDeletePost}
                                    >
                                        Yes
                                    </Button>
                                </div>
                            </Modal_Center>
                        )}
                    </div>
                </>
            )}

            {/* Comment Section */}
            <AnimatePresence>
                {isShowPanel &&
                    (didLogin ? (
                        <Comment setIsShowComment={setIsShowPanel} />
                    ) : (
                        <Login
                            key={"oppenLogin"}
                            handleClosePanel={setIsShowPanel}
                        />
                    ))}
            </AnimatePresence>
            {isShowComment.isShow && (
                <Comment
                    setIsShowComment={setIsShowComment}
                    dataShow={isShowComment.data}
                />
            )}

            {isShowLoadingModal && <LoadingModal />}
            {isShowToast.isShow && (
                <Toast
                    state={isShowToast.type}
                    message={isShowToast.message}
                />
            )}
        </FrameRecommendVideo>
    );
}

export default PostInfor;
