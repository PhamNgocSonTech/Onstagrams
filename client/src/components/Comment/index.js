import classNames from "classnames/bind";
import styles from "./Comment.module.scss";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

import Modal from "../common/Modal";
import Button from "../common/Button";
import close from "../../assets/image/modal/close.svg";
import black_heart from "../../assets/image/content/black_heart.svg";
import pink_heart from "../../assets/image/content/pink_heart.svg";
import comment from "../../assets/image/content/comment.svg";
import share from "../../assets/image/content/share.svg";
import heart_outline from "../../assets/image/modal/heart_outline.svg";
import smile from "../../assets/image/modal/smile.svg";

const cn = classNames.bind(styles);

function Comment({ setIsShowComment }) {
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
    });

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
                <img
                    className={cn("img-section")}
                    src='https://kenh14cdn.com/thumb_w/660/2020/6/23/a483bd33d4c46bf25bac64d11cdb04d8-159292559942978254085.jpg'
                />
                <div className={cn("cmt-section")}>
                    <div className={cn("owner-infor")}>
                        <div className={cn("owner")}>
                            <img
                                className={cn("owner-avatar")}
                                src='https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/27090e4b6826f4471c40afb66771d5ce.jpeg?x-expires=1666843200&x-signature=ogQ00wzSeEyfEvRat%2Fm99FoZGZ4%3D'
                                alt=''
                            />
                            <div className={cn("infor")}>
                                <h3>cuong_nguyen</h3>
                                <h4>cuong_ng_123 - 3d ago</h4>
                            </div>

                            {isFollow ? (
                                <Button
                                    onClick={handleChangeFollower}
                                    className={cn("following")}
                                    outline
                                >
                                    <p className={cn("fling-text")}>
                                        Following
                                    </p>
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

                        <p className={cn("cap")}>
                            Bạn có đủ dũng cảm để tiếp tục tình yêu dù biết rằng
                            sẽ không đem lại kết quả? 😂
                        </p>
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
                        <div className={cn("comment")}>
                            <img
                                src='https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/d33b7f5618c3f0a7f264c7dff5e225eb~c5_100x100.jpg?x-expires=1666792800&x-signature=5v8pXrRs%2FPkmuhoq2cSTZNsxkNs%3D'
                                alt=''
                            />
                            <div className={cn("comment-content")}>
                                <h3>Đẹp trai nhưng ngu vãi lồn🍀</h3>
                                <h4>Đúng vậy {":(("}</h4>
                                <div className={cn("cmt-footer")}>
                                    <span className={cn("cmt-time")}>
                                        4d ago
                                    </span>
                                    <span className={cn("cmt-reply")}>
                                        Reply
                                    </span>
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
                                    <span className={cn("cmt-time")}>
                                        4d ago
                                    </span>
                                    <span className={cn("cmt-reply")}>
                                        Reply
                                    </span>
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
                                    <span className={cn("cmt-time")}>
                                        4d ago
                                    </span>
                                    <span className={cn("cmt-reply")}>
                                        Reply
                                    </span>
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
                                    <span className={cn("cmt-time")}>
                                        4d ago
                                    </span>
                                    <span className={cn("cmt-reply")}>
                                        Reply
                                    </span>
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
                                onClick={handleShowEmotePicker}
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
