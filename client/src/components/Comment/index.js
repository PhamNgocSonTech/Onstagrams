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
    const [isHaveComment, setIsHaveComment] = useState(false);
    const [postCurrent, setPostCurrent] = useState({});
    const [isFollow, setIsFollow] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const [isShowEmotePicker, setIsShowEmotePicker] = useState(false);
    const [cmt, setCmt] = useState("");
    const ref = useRef();

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
        getPostByIdPost(srcDataShow.current[currentComment].postID).then((post) => {
            if (post.status === 200) {
                const userid = post.data[0].userId;
                getUserById(userid).then((user) => {
                    if (user.status === 200) {
                        setUserCurrent(user.data);
                        setPostCurrent(post.data[0]);
                    }
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

    return (
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

                    {srcDataShow.current.length >= 2 && (
                        <>
                            <img
                                src={left}
                                alt='left'
                                className={cn("slide", "left")}
                                onClick={handlePreClick}
                            />
                            <img
                                src={right}
                                alt='right'
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
                            <span className={cn("act-text")}>130K</span>
                        </div>
                        <div className={cn("action")}>
                            <div className={cn("act-btn")}>
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

                    <div className={cn("comments")}>
                        {isHaveComment ? (
                            <>
                                {" "}
                                <div className={cn("comment")}>
                                    <img
                                        src='https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/d33b7f5618c3f0a7f264c7dff5e225eb~c5_100x100.jpg?x-expires=1666792800&x-signature=5v8pXrRs%2FPkmuhoq2cSTZNsxkNs%3D'
                                        alt=''
                                    />
                                    <div className={cn("comment-content")}>
                                        <h3>Đẹp trai nhưng ngu vãi lồn🍀</h3>
                                        <h4>Đúng vậy {":(("}</h4>
                                        <div className={cn("cmt-footer")}>
                                            <span className={cn("cmt-time")}>4d ago</span>
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
                                        <span className={cn("act-text-cmt")}>1</span>
                                    </div>
                                </div>
                                <div className={cn("comment")}>
                                    <img
                                        src='https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/73e50e80740d8e56895151775d681f9a~c5_100x100.jpg?x-expires=1666803600&x-signature=qx6m02mSh%2Fi4osstYbcS%2FMj%2BrUs%3D'
                                        alt=''
                                    />
                                    <div className={cn("comment-content")}>
                                        <h3>Sói Ngây Ngô</h3>
                                        <h4>Chẳng có thứ gì tồn tại mãi mãi ^^</h4>
                                        <div className={cn("cmt-footer")}>
                                            <span className={cn("cmt-time")}>4d ago</span>
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
                                        <span className={cn("act-text-cmt")}>13</span>
                                    </div>
                                </div>
                                <div className={cn("comment")}>
                                    <img
                                        src='https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/7124822249265168389~c5_100x100.jpg?x-expires=1666803600&x-signature=BBjg8XF2b3FcFkUtgeKbnAITqjc%3D'
                                        alt=''
                                    />
                                    <div className={cn("comment-content")}>
                                        <h3>LpVy2909</h3>
                                        <h4>Chấp nhận thôi -.-</h4>
                                        <div className={cn("cmt-footer")}>
                                            <span className={cn("cmt-time")}>4d ago</span>
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
                                        <span className={cn("act-text-cmt")}>2</span>
                                    </div>
                                </div>
                                <div className={cn("comment")}>
                                    <img
                                        src='https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/1d28f283320c12d138eadb35859499d4~c5_100x100.jpg?x-expires=1666803600&x-signature=5NQvQ5J2JYTVIVQqx%2BVdxI%2BwHN0%3D'
                                        alt=''
                                    />
                                    <div className={cn("comment-content")}>
                                        <h3>vợ Lee Jong Suk</h3>
                                        <h4>Cay đắng</h4>
                                        <div className={cn("cmt-footer")}>
                                            <span className={cn("cmt-time")}>4d ago</span>
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
                                        <span className={cn("act-text-cmt")}>2</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={cn("empty-cmt")}>
                                <img
                                    src={comments}
                                    alt=''
                                />
                                <h2>No comment now !</h2>
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
    );
}

export default Comment;
