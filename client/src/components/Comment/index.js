import classNames from "classnames/bind";
import styles from "./Comment.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

import Modal from "../common/Modal";
import Button from "../common/Button";
import close from "../../assets/image/modal/close-white.svg";
import black_heart from "../../assets/image/content/black_heart.svg";
import pink_heart from "../../assets/image/content/pink_heart.svg";
import comment from "../../assets/image/content/comment.svg";
import share from "../../assets/image/content/share.svg";
import heart_outline from "../../assets/image/modal/heart_outline.svg";
import smile from "../../assets/image/modal/smile.svg";
import left from "../../assets/image/comment/left.svg";
import right from "../../assets/image/comment/right.svg";
import comments from "../../assets/image/comment/comments.svg";
import more from "../../assets/image/comment/more.svg";
import hashtag from "../../assets/image/upload/hashtag.svg";
import { createComment, createPost, deletePost, editPost, getPostByIdPost } from "../../utils/HttpRequest/post_request";
import { followUserHasId, getUserById, unfollowUserHasId } from "../../utils/HttpRequest/user_request";
import { urlToObject } from "../../utils/URLtoFileObject/convertURL";
import moment from "moment";

import { fabClasses, Skeleton } from "@mui/material";
import jwt_decode from "jwt-decode";
import Popover from "../common/Popover";
import Modal_Center from "../common/Modal/Modal_Center";
import Toast from "../common/Toast";
import LoadingModal from "../common/LoadingModal";
import { useNavigate } from "react-router-dom";
import Login from "../Login";
import { checkExpiredToken } from "../../utils/CheckExpiredToken/checkExpiredToken";
import { refreshToken } from "../../utils/HttpRequest/auth_request";

const cn = classNames.bind(styles);

function Comment({ setIsShowComment, dataShow = [] }) {
    /** dataShow
     * [
     *    {
     *        postID: "1s23d2d3qs"
     *        url: "http://example.com"
     *    },
     *    {
     *        postID: "1s23d2d3qs"
     *        url: "http://example.com"
     *        show: true
     *    },
     *    {
     *        postID: "1s23d2d3qs"
     *        url: "http://example.com"
     *    }
     * ]
     */
    const srcDataShow = useRef(dataShow);
    const [currentComment, setCurrentComment] = useState(srcDataShow.current.findIndex((item) => item.show == true));
    const [userCurrent, setUserCurrent] = useState({});
    const [isGetAPIDone, setIsGetAPIDone] = useState(false);
    const [postCurrent, setPostCurrent] = useState({ comments: [], likes: [], comments: [] });
    const [isFollow, setIsFollow] = useState(false);
    const [isMyPost, setIsMyPost] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const [isShowEmotePicker, setIsShowEmotePicker] = useState(false);
    const [cmt, setCmt] = useState("");
    const ref = useRef();
    const refDelete = useRef();
    const refUpdate = useRef();
    const htRef = useRef();
    const ipcmtRef = useRef();
    const navigate = useNavigate();

    const [isOpenFormDelete, setIsOpenFormDelete] = useState(false);
    const [isOpenAcceptDeleteOption, setIsOpenAcceptDeleteOption] = useState(false);

    const [descBind, setDescBind] = useState("");
    const [hashtagBind, setHashtagBind] = useState("");

    const [isShowEditMode, setIsShowEditMode] = useState(false);

    const [isShowToast, setIsShowToast] = useState({ isShow: false, type: false, message: "" });
    const [isShowLoadingModal, setIsShowLoadingModal] = useState(false);

    const [isShowSubToast, setisShowSubToast] = useState({ isShow: false, type: false, message: "" });
    const [isShowLoginForm, setIsShowLoginForm] = useState();

    const [animate, setAnimate] = useState(false);

    const [refreshData, setRefreshData] = useState(false);

    function handleInputChange(index, e) {
        if (index === 0) {
            // Hashtag field
            setHashtagBind(e.target.value);
        }

        if (index === 1) {
            // desc field
            setDescBind(e.target.value);
        }
    }

    function handleNavigateToProfile(id) {
        navigate(`/profile/${id}`);
        setIsShowComment(false);
    }

    async function handleSubmitComment() {
        let token = window.localStorage.getItem("accessToken");

        if (checkExpiredToken(token)) {
            // Expired token
            const rt = window.localStorage.getItem("refreshToken");
            await refreshToken(rt).then((newat) => {
                token = newat.data.accessToken;
                window.localStorage.setItem("accessToken", newat.data.accessToken);
            });
        }

        const idPost = srcDataShow.current[currentComment].postID;
        createComment(token, idPost, { comment: cmt }).then((res) => {
            setRefreshData(!refreshData);
            setCmt("");
        });
    }

    async function handleDeletePost() {
        setIsShowLoadingModal(true);

        let token = window.localStorage.getItem("accessToken");

        if (checkExpiredToken(token)) {
            // Expired token
            const rt = window.localStorage.getItem("refreshToken");
            await refreshToken(rt).then((newat) => {
                token = newat.data.accessToken;
                window.localStorage.setItem("accessToken", newat.data.accessToken);
            });
        }

        getPostByIdPost(srcDataShow.current[currentComment].postID).then((res) => {
            const currPost = res.data[0];
            const listImage = currPost.img.filter((imgUrl) => imgUrl.url !== srcDataShow.current[currentComment].url);
            if (listImage.length > 0) {
                // UPADATE PHOTO OF POST
                const urlForm = listImage.map((img) => ({
                    url: img.url,
                    name: `${img.etag}.${img.format}`,
                }));
                Promise.all(urlForm.map((imgurl) => urlToObject(imgurl.url, imgurl.name))).then((res) => {
                    let frmData = new FormData();
                    res.forEach((file) => {
                        frmData.append("img", file, file.name);
                    });
                    editPost(token, srcDataShow.current[currentComment].postID, frmData).then((res) => {
                        setIsShowLoadingModal(false);
                        if (res.status === 200 || res.status === 304) {
                            setIsShowToast({
                                isShow: true,
                                type: true,
                                message: "Deleted this photo successfully!",
                            });
                            setTimeout(() => {
                                window.location.reload(true);
                            }, 1000);
                        } else {
                            setIsShowToast({
                                isShow: false,
                                type: false,
                                message: res.data,
                            });
                        }
                    });
                });
            } else {
                // LAST IMAGE => DELETE POST
                deletePost(token, srcDataShow.current[currentComment].postID).then((res) => {
                    setIsShowLoadingModal(false);
                    if (res.status === 200 || res.status === 304) {
                        setIsShowToast({
                            isShow: true,
                            type: true,
                            message: "Deleted this photo successfully!",
                        });
                        setTimeout(() => {
                            window.location.reload(true);
                        }, 1000);
                    } else {
                        setIsShowToast({
                            isShow: false,
                            type: false,
                            message: res.data,
                        });
                    }
                });
            }
            setIsShowToast({ isShow: false, type: false, message: "" });
        });
    }

    const handleUpdatePost = async () => {
        let token = window.localStorage.getItem("accessToken");

        if (checkExpiredToken(token)) {
            // Expired token
            const rt = window.localStorage.getItem("refreshToken");
            await refreshToken(rt).then((newat) => {
                token = newat.data.accessToken;
                window.localStorage.setItem("accessToken", newat.data.accessToken);
            });
        }
        setIsShowLoadingModal(true);
        const imgArr = postCurrent.img.map((img) => ({
            url: img.url,
            name: `${img.etag}.${img.format}`,
        }));
        Promise.all(imgArr.map((item) => urlToObject(item.url, item.name))).then((res) => {
            let frmData = new FormData();
            res.forEach((file) => {
                frmData.append("img", file, file.name);
            });
            frmData.append("desc", descBind);
            frmData.append("hashtag", hashtagBind);
            editPost(token, postCurrent._id, frmData).then((res) => {
                setIsShowLoadingModal(false);
                if (res.status === 200 || res.status === 304) {
                    setIsShowToast({ isShow: true, type: true, message: "Edit successfully !" });
                    setTimeout(() => {
                        setIsShowEditMode(false);
                    }, 1000);
                } else {
                    setIsShowToast({ isShow: true, type: false, message: res.data });
                }
            });
            setIsShowToast({ isShow: false, type: true, message: "" });
        });
    };

    async function handleChangeFollower() {
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

            if (isFollow) {
                // Handle Unfollow
                unfollowUserHasId(userCurrent._id, token).then((res) => {
                    if (res.status === 200 || res.status === 304) {
                        setIsFollow(false);
                    }
                });
            } else {
                // Handle Follow
                followUserHasId(userCurrent._id, token).then((res) => {
                    if (res.status === 200 || res.status === 304) {
                        setIsFollow(true);
                    }
                });
            }
        } else {
            setIsShowLoginForm(true);
        }
    }

    function handleClickHashTag() {
        setHashtagBind((pre) => pre + "#");
        htRef.current.focus();
    }

    function handleCloseComment() {
        setIsShowComment(false);
    }

    function handleLike() {
        setIsLike(!isLike);
    }

    function handleCommentType(e) {
        setCmt(e.target.value);
    }

    function handleToggleEmotePicker() {
        setIsShowEmotePicker(!isShowEmotePicker);
    }

    function handleShowEmotePicker() {
        setIsShowEmotePicker(true);
    }

    function handleHideEmotePicker() {
        setIsShowEmotePicker(false);
    }

    function handleEmoteClick(emoji) {
        setDescBind((pre) => pre + emoji.emoji);
    }

    const animations = {
        like: {
            scale: [1, 1.4, 0.8, 1],
        },
        dislike: {},
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsShowEmotePicker(false);
            }
            if (refDelete.current && !refDelete.current.contains(event.target)) {
                setIsOpenAcceptDeleteOption(false);
            }
            if (refUpdate.current && !refUpdate.current.contains(event.target)) {
                setIsShowEmotePicker(false);
            }
        };
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    useEffect(() => {
        // GET POST
        getPostByIdPost(srcDataShow.current[currentComment].postID).then((post) => {
            if (post.status === 200) {
                const userid = post.data[0].userId;
                // GET AUTHOR INFOR
                getUserById(userid).then((user) => {
                    if (user.status === 200) {
                        setUserCurrent(user.data);
                        const token = window.localStorage.getItem("accessToken");
                        if (token) {
                            // LOGGED IN
                            const id_current = jwt_decode(token)._id;
                            // CHECK FOLLOW
                            if (id_current === user.data._id) {
                                setIsMyPost(true);
                            } else {
                                user.data.followers.filter((Idfollower) => Idfollower === id_current).length > 0 &&
                                    setIsFollow(true);
                            }
                        }
                    }
                });

                // GET COMMENT USER INFOR
                let reqs = [];
                post.data[0].comments.forEach((user) => {
                    reqs.push(user.userId);
                });
                Promise.all(reqs.map((id) => getUserById(id))).then((allRes) => {
                    post.data[0].usercomments = allRes;
                    setPostCurrent(post.data[0]);
                    setDescBind(post.data[0].desc);
                    setHashtagBind(post.data[0].hashtag);
                    setIsGetAPIDone(true);
                });
            }
        });
    }, [currentComment, refreshData]);

    const handleNextClick = () => {
        setIsShowEditMode(false);
        currentComment == srcDataShow.current.length - 1 ? setCurrentComment(0) : setCurrentComment((pre) => pre + 1);
    };

    const handlePreClick = () => {
        setIsShowEditMode(false);
        currentComment == 0 ? setCurrentComment(srcDataShow.current.length - 1) : setCurrentComment((pre) => pre - 1);
    };

    return isGetAPIDone ? (
        <Modal>
            <div className={cn("wrapper")}>
                <div
                    className={cn("close-btn")}
                    onClick={handleCloseComment}
                >
                    <img
                        src={close}
                        alt='close'
                    />
                </div>
                <div className={cn("img-section")}>
                    <img
                        onMouseEnter={() => setAnimate(true)}
                        onMouseLeave={() => setAnimate(false)}
                        src={srcDataShow.current[currentComment].url}
                    />

                    {srcDataShow.current.length >= 2 && (
                        <>
                            <motion.img
                                src={left}
                                alt='left'
                                className={cn("slide", "left")}
                                onClick={handlePreClick}
                                initial={{ opacity: 0, left: 0 }}
                                whileHover={{ opacity: 1, left: 20 }}
                                animate={animate ? { opacity: 1, left: 20 } : { opacity: 0, left: 0 }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                }}
                            />
                            <motion.img
                                src={right}
                                alt='right'
                                initial={{ opacity: 0, right: 0 }}
                                whileHover={{ opacity: 1, right: 20 }}
                                animate={animate ? { opacity: 1, right: 20 } : { opacity: 0, right: 0 }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                }}
                                onClick={handleNextClick}
                                className={cn("slide", "right")}
                            />
                        </>
                    )}
                </div>
                <div className={cn("cmt-section")}>
                    <div className={cn("owner-infor")}>
                        <div className={cn("owner")}>
                            <img
                                className={cn("owner-avatar")}
                                src={userCurrent.avatar}
                                alt=''
                                onClick={() => handleNavigateToProfile(userCurrent._id)}
                            />
                            <div
                                className={cn("infor")}
                                onClick={() => handleNavigateToProfile(userCurrent._id)}
                            >
                                <h3>{userCurrent.username}</h3>
                                <h4>
                                    {userCurrent.fullname} - {moment(postCurrent.createdAt).fromNow()}
                                </h4>
                            </div>

                            {isMyPost ? (
                                <div
                                    className={cn("more-btn")}
                                    ref={refDelete}
                                >
                                    <img
                                        src={more}
                                        alt=''
                                        onClick={() => setIsOpenAcceptDeleteOption(!isOpenAcceptDeleteOption)}
                                    />
                                    {isOpenAcceptDeleteOption && (
                                        <Popover className={cn("delete-post")}>
                                            <Button
                                                className={cn("btn-option", "btn-1")}
                                                outline
                                                onClick={() => {
                                                    setIsShowEditMode(true);
                                                    setIsOpenAcceptDeleteOption(false);
                                                }}
                                            >
                                                Edit this post
                                            </Button>
                                            <Button
                                                outline
                                                className={cn("btn-option", "btn-2")}
                                                onClick={() => {
                                                    setIsOpenAcceptDeleteOption(false);
                                                    setIsOpenFormDelete(true);
                                                }}
                                            >
                                                Delete this photo
                                            </Button>
                                        </Popover>
                                    )}
                                    <AnimatePresence>
                                        {isOpenFormDelete && (
                                            <Modal_Center
                                                key={"deleteMD"}
                                                className={cn("accept-delete-form")}
                                            >
                                                <h2>Are you sure to delete this photo ? </h2>
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
                                                {isShowSubToast.isShow && (
                                                    <Toast
                                                        message={isShowSubToast.message}
                                                        state={isShowSubToast.type}
                                                    />
                                                )}
                                            </Modal_Center>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : isFollow ? (
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
                        </div>
                        <AnimatePresence>
                            {isShowEditMode ? (
                                <motion.div
                                    key={"cut"}
                                    className={cn("cap-upload")}
                                    // animate={{
                                    //     rotate: 720,
                                    //     x: [0, -900, 0, 200, 0],
                                    //     y: [0, -300, 0, 300, 0],
                                    // }}
                                    // transition={{ repeat: Infinity, duration: 20 }}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 100 }}
                                >
                                    <div className={cn("hashtag2")}>
                                        <div className={cn("add-comment2")}>
                                            <div className={cn("input-field2")}>
                                                <input
                                                    type='text'
                                                    placeholder='Add hashtag...'
                                                    onChange={(e) => handleInputChange(0, e)}
                                                    value={hashtagBind}
                                                    ref={htRef}
                                                />
                                                <img
                                                    src={hashtag}
                                                    alt=''
                                                    onClick={handleClickHashTag}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cn("caption2")}>
                                        <div className={cn("add-comment2")}>
                                            <div
                                                className={cn("input-field2")}
                                                ref={refUpdate}
                                            >
                                                <textarea
                                                    className={cn("cap-input2")}
                                                    placeholder='Hmmmm, What are you thinking about...?'
                                                    value={descBind}
                                                    onChange={(e) => handleInputChange(1, e)}
                                                    onFocus={() => setIsShowEmotePicker(false)}
                                                ></textarea>
                                                <img
                                                    src={smile}
                                                    alt=''
                                                    onClick={() => setIsShowEmotePicker(!isShowEmotePicker)}
                                                />
                                                {isShowEmotePicker && (
                                                    <div className={cn("emote-picker2")}>
                                                        <EmojiPicker
                                                            emojiStyle='facebook'
                                                            onEmojiClick={handleEmoteClick}
                                                            lazyLoadEmojis={false}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cn("submit-update2")}>
                                        <Button
                                            outlinePrimary
                                            onClick={() => {
                                                setIsShowEditMode(false);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            primary
                                            onClick={handleUpdatePost}
                                        >
                                            Update
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <>
                                    <p className={cn("cap")}>{descBind}</p>
                                    {hashtagBind &&
                                        hashtagBind.split(" ").map((ht, index) => (
                                            <Button
                                                key={index}
                                                className={cn("hashtag")}
                                            >
                                                {ht}
                                            </Button>
                                        ))}
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {!isShowEditMode && (
                        <>
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
                                            animate={isLike ? "like" : "unlike"}
                                        />
                                    </div>
                                    <span className={cn("act-text")}>{postCurrent.likes.length}</span>
                                </div>
                                <div className={cn("action")}>
                                    <div className={cn("act-btn")}>
                                        <motion.img
                                            alt='img'
                                            whileHover={{ rotate: ["0", "-45deg", "45deg", "0deg"] }}
                                            src={comment}
                                        />
                                    </div>
                                    <span className={cn("act-text")}>{postCurrent.comments.length}</span>
                                </div>
                                <div className={cn("action")}>
                                    <div className={cn("act-btn")}>
                                        <motion.img
                                            whileHover={{ rotate: ["0", "-45deg", "45deg", "0deg"] }}
                                            alt='img'
                                            src={share}
                                        />
                                    </div>
                                    <span className={cn("act-text")}>0</span>
                                </div>
                            </div>
                            <div className={cn("comments")}>
                                {postCurrent.comments.length > 0 ? (
                                    <>
                                        {postCurrent.comments.map((cmt, index) => (
                                            <div
                                                key={index}
                                                className={cn("comment")}
                                            >
                                                <img
                                                    src={postCurrent.usercomments[index].data.avatar}
                                                    alt='avatar'
                                                    onClick={() =>
                                                        handleNavigateToProfile(
                                                            postCurrent.usercomments[index].data._id
                                                        )
                                                    }
                                                />
                                                <div className={cn("comment-content")}>
                                                    <h3
                                                        onClick={() =>
                                                            handleNavigateToProfile(
                                                                postCurrent.usercomments[index].data._id
                                                            )
                                                        }
                                                    >
                                                        {postCurrent.usercomments[index].data.username}
                                                    </h3>
                                                    <h4>{cmt.comment}</h4>
                                                    <div className={cn("cmt-footer")}>
                                                        <span className={cn("cmt-time")}>
                                                            {moment(cmt.createdAt).fromNow()}
                                                        </span>
                                                        <span className={cn("cmt-reply")}>Reply</span>
                                                    </div>
                                                </div>
                                                <div className={cn("action-cmt")}>
                                                    <div className={cn("act-btn-cmt")}>
                                                        <img
                                                            alt='img'
                                                            src={heart_outline}
                                                        />
                                                    </div>
                                                    <span className={cn("act-text-cmt")}>0</span>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className={cn("empty-cmt")}>
                                        <img
                                            src={comments}
                                            alt=''
                                        />
                                        <h3>No comment now !</h3>
                                    </div>
                                )}
                            </div>
                            <div className={cn("add-comment")}>
                                {window.localStorage.getItem("accessToken") ? (
                                    <>
                                        {" "}
                                        <div
                                            className={cn("input-field")}
                                            ref={ref}
                                        >
                                            {isShowEmotePicker && (
                                                <div className={cn("emote-picker")}>
                                                    <EmojiPicker
                                                        emojiStyle='facebook'
                                                        onEmojiClick={(emote) => setCmt((pre) => pre + emote.emoji)}
                                                        lazyLoadEmojis={true}
                                                    />
                                                </div>
                                            )}

                                            <input
                                                type='text'
                                                value={cmt}
                                                onChange={handleCommentType}
                                                placeholder='Add comment...'
                                                onFocus={handleHideEmotePicker}
                                                ref={ipcmtRef}
                                            />
                                            <img
                                                onClick={handleToggleEmotePicker}
                                                src={smile}
                                                alt=''
                                            />
                                        </div>
                                        <Button
                                            outline
                                            onClick={handleSubmitComment}
                                        >
                                            Post
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            outlinePrimary={true}
                                            className={cn("login-btn")}
                                            onClick={() => setIsShowLoginForm(true)}
                                        >
                                            Login to comment this post
                                        </Button>
                                        {
                                            <AnimatePresence>
                                                {isShowLoginForm && (
                                                    <Login
                                                        key={"lg"}
                                                        handleClosePanel={setIsShowLoginForm}
                                                    />
                                                )}
                                            </AnimatePresence>
                                        }
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
                {isShowToast.isShow && (
                    <Toast
                        state={isShowToast.type}
                        message={isShowToast.message}
                    />
                )}
                {isShowLoadingModal && <LoadingModal />}
            </div>
        </Modal>
    ) : (
        <Modal>
            <div className={cn("wrapper")}>
                <div
                    className={cn("close-btn")}
                    onClick={handleCloseComment}
                >
                    <img
                        src={close}
                        alt='close'
                    />
                </div>
                <div className={cn("img-section")}>
                    <img src={srcDataShow.current[currentComment].url} />
                </div>
                <div className={cn("cmt-section")}>
                    <div className={cn("owner-infor")}>
                        <div className={cn("owner")}>
                            <Skeleton
                                variant='rounded'
                                className={cn("owner-avatar")}
                            />
                            <div className={cn("infor")}>
                                <h3>
                                    <Skeleton
                                        variant='text'
                                        sx={{ width: "300px" }}
                                    />
                                </h3>
                                <h4>
                                    <Skeleton
                                        variant='text'
                                        sx={{ width: "200px" }}
                                    />
                                </h4>
                            </div>
                        </div>

                        <p className={cn("cap")}>
                            <Skeleton
                                variant='text'
                                sx={{ width: "400px" }}
                            />
                        </p>
                    </div>

                    <div className={cn("actions")}>
                        <div className={cn("action")}>
                            <div className={cn("act-btn")}>
                                <Skeleton
                                    variant='rounded'
                                    className={cn("owner-avatar")}
                                />
                            </div>
                            <span className={cn("act-text")}>
                                <Skeleton variant='text' />
                            </span>
                        </div>
                        <div className={cn("action")}>
                            <div className={cn("act-btn")}>
                                <Skeleton
                                    variant='rounded'
                                    className={cn("owner-avatar")}
                                />
                            </div>
                            <span className={cn("act-text")}>
                                <Skeleton variant='text' />
                            </span>
                        </div>
                        <div className={cn("action")}>
                            <div className={cn("act-btn")}>
                                <Skeleton
                                    variant='rounded'
                                    className={cn("owner-avatar")}
                                />
                            </div>
                            <span className={cn("act-text")}>
                                <Skeleton variant='text' />
                            </span>
                        </div>
                    </div>

                    <div className={cn("comments")}>
                        <>
                            <div className={cn("comment")}>
                                <Skeleton
                                    variant='circular'
                                    sx={{ width: "50px", height: "50px" }}
                                />
                                <div className={cn("comment-content")}>
                                    <h3>
                                        <Skeleton
                                            variant='text'
                                            sx={{ width: "80px" }}
                                        />
                                    </h3>
                                    <h4>
                                        <Skeleton
                                            variant='text'
                                            sx={{ width: "300px" }}
                                        />
                                    </h4>
                                    <div className={cn("cmt-footer")}>
                                        <span className={cn("cmt-time")}>
                                            <Skeleton
                                                variant='text'
                                                sx={{ width: "20px" }}
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={cn("comment")}>
                                <Skeleton
                                    variant='circular'
                                    sx={{ width: "50px", height: "50px" }}
                                />
                                <div className={cn("comment-content")}>
                                    <h3>
                                        <Skeleton
                                            variant='text'
                                            sx={{ width: "80px" }}
                                        />
                                    </h3>
                                    <h4>
                                        <Skeleton
                                            variant='text'
                                            sx={{ width: "300px" }}
                                        />
                                    </h4>
                                    <div className={cn("cmt-footer")}>
                                        <span className={cn("cmt-time")}>
                                            <Skeleton
                                                variant='text'
                                                sx={{ width: "20px" }}
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={cn("comment")}>
                                <Skeleton
                                    variant='circular'
                                    sx={{ width: "50px", height: "50px" }}
                                />
                                <div className={cn("comment-content")}>
                                    <h3>
                                        <Skeleton
                                            variant='text'
                                            sx={{ width: "80px" }}
                                        />
                                    </h3>
                                    <h4>
                                        <Skeleton
                                            variant='text'
                                            sx={{ width: "300px" }}
                                        />
                                    </h4>
                                    <div className={cn("cmt-footer")}>
                                        <span className={cn("cmt-time")}>
                                            <Skeleton
                                                variant='text'
                                                sx={{ width: "20px" }}
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default Comment;
