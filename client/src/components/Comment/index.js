import classNames from "classnames/bind";
import styles from "./Comment.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
import { deletePost, editPost, getPostByIdPost } from "../../utils/HttpRequest/post_request";
import { getUserById } from "../../utils/HttpRequest/user_request";
import { urlToObject } from "../../utils/URLtoFileObject/convertURL";
import moment from "moment";

import { Skeleton } from "@mui/material";
import jwt_decode from "jwt-decode";
import Popover from "../common/Popover";
import Modal_Center from "../common/Modal/Modal_Center";
import Toast from "../common/Toast";
import LoadingModal from "../common/LoadingModal";

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

    const [isOpenFormDelete, setIsOpenFormDelete] = useState(false);
    const [isOpenAcceptDeleteOption, setIsOpenAcceptDeleteOption] = useState(false);

    const [descBind, setDescBind] = useState("");
    const [hashtagBind, setHashtagBind] = useState("");

    const [isShowEditMode, setIsShowEditMode] = useState(false);

    const [isShowToast, setIsShowToast] = useState({ isShow: false, type: true, message: "" });
    const [isShowLoadingModal, setIsShowLoadingModal] = useState(false);

    const [isShowSubToast, setisShowSubToast] = useState({ isShow: false, type: true, message: "" });

    const [animate, setAnimate] = useState(false);

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

    function handleDeletePost() {
        // setIsShowLoadingModal(true);
        // const token = window.localStorage.getItem("accessToken");
        // deletePost(token, postCurrent._id).then((res) => {
        //     setIsShowLoadingModal(false);
        //     console.log(isShowToast);
        //     if (res.status === 200 || res.status === 304) {
        //         setisShowSubToast({ isShow: true, type: false, message: res.data });
        //         setTimeout(() => {
        //             window.location.reload();
        //         }, 1000);
        //     } else {
        //         setisShowSubToast({ isShow: true, type: false, message: res.data });
        //     }
        //     setisShowSubToast({ isShow: false, type: false, message: "" });
        // });
    }

    const handleUpdatePost = () => {
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
            const token = window.localStorage.getItem("accessToken");
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

    function handleChangeFollower() {
        setIsFollow(!isFollow);
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
                            const id_current = jwt_decode(token)._id;
                            id_current === user.data._id && setIsMyPost(true);
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
    }, [currentComment]);

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
                            />
                            <div className={cn("infor")}>
                                <h3>{userCurrent.username}</h3>
                                <h4>
                                    {userCurrent.fullname} - {moment(postCurrent.createdAt).startOf("hour").fromNow()}
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
                                    {isOpenFormDelete && (
                                        <Modal_Center className={cn("accept-delete-form")}>
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
                                    <div className={cn("hashtag")}>
                                        <div className={cn("add-comment")}>
                                            <div className={cn("input-field")}>
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
                                    <div className={cn("caption")}>
                                        <div className={cn("add-comment")}>
                                            <div
                                                className={cn("input-field")}
                                                ref={refUpdate}
                                            >
                                                <textarea
                                                    className={cn("cap-input")}
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
                                                    <div className={cn("emote-picker")}>
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
                                    <div className={cn("submit-update")}>
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
                                            src={isLike ? pink_heart : black_heart}
                                            animate={isLike ? "like" : "unlike"}
                                        />
                                    </div>
                                    <span className={cn("act-text")}>{postCurrent.likes.length}</span>
                                </div>
                                <div className={cn("action")}>
                                    <div className={cn("act-btn")}>
                                        <img
                                            alt='img'
                                            src={comment}
                                        />
                                    </div>
                                    <span className={cn("act-text")}>{postCurrent.comments.length}</span>
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
                                                />
                                                <div className={cn("comment-content")}>
                                                    <h3>{postCurrent.usercomments[index].data.username}</h3>
                                                    <h4>{cmt.comment}</h4>
                                                    <div className={cn("cmt-footer")}>
                                                        <span className={cn("cmt-time")}>
                                                            {moment(cmt.createdAt).startOf("hour").fromNow()}
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
                                <div
                                    className={cn("input-field")}
                                    ref={ref}
                                >
                                    {isShowEmotePicker && (
                                        <div className={cn("emote-picker")}>
                                            <EmojiPicker
                                                emojiStyle='facebook'
                                                onEmojiClick={handleEmoteClick}
                                            />
                                        </div>
                                    )}
                                    <input
                                        type='text'
                                        value={cmt}
                                        onChange={handleCommentType}
                                        placeholder='Add comment...'
                                        onFocus={handleHideEmotePicker}
                                    />
                                    <img
                                        onClick={handleToggleEmotePicker}
                                        src={smile}
                                        alt=''
                                    />
                                </div>
                                <Button outline>Post</Button>
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
