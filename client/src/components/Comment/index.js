import classNames from "classnames/bind";
import styles from "./Comment.module.scss";
import { motion } from "framer-motion";
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
import { getPostByIdPost } from "../../utils/HttpRequest/post_request";
import { getUserById } from "../../utils/HttpRequest/user_request";
import moment from "moment";

import { Skeleton } from "@mui/material";

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
    const [isLike, setIsLike] = useState(false);
    const [isShowEmotePicker, setIsShowEmotePicker] = useState(false);
    const [cmt, setCmt] = useState("");
    const ref = useRef();

    const [animate, setAnimate] = useState(false);

    function handleChangeFollower() {
        setIsFollow(!isFollow);
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
        setCmt((pre) => pre + emoji.emoji);
    }

    const animations = {
        like: {
            scale: [1, 1.4, 0.8, 1],
        },
        dislike: {},
    };

    useEffect(() => {
        if (isShowEmotePicker) {
            const handleClickOutside = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    setIsShowEmotePicker(false);
                }
            };
            document.addEventListener("click", handleClickOutside, true);
            return () => {
                document.removeEventListener("click", handleClickOutside, true);
            };
        }
        // GET POST
        getPostByIdPost(srcDataShow.current[currentComment].postID).then((post) => {
            if (post.status === 200) {
                const userid = post.data[0].userId;
                // GET AUTHOR INFOR
                getUserById(userid).then((user) => {
                    if (user.status === 200) {
                        setUserCurrent(user.data);
                        console.log(post.data[0]);
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
                    setIsGetAPIDone(true);
                });
            }
        });
    }, [currentComment]);

    const handleNextClick = () => {
        currentComment == srcDataShow.current.length - 1 ? setCurrentComment(0) : setCurrentComment((pre) => pre + 1);
    };

    const handlePreClick = () => {
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
                    <motion.img
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
                        </div>

                        <p className={cn("cap")}>{postCurrent.desc}</p>
                    </div>

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
                </div>
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
