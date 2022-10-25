import classNames from "classnames/bind";
import styles from "./Comment.module.scss";
import { motion } from "framer-motion";
import { useState } from "react";

import Modal from "../common/Modal";
import Button from "../common/Button";
import close from "../../assets/image/modal/close.svg";
import black_heart from "../../assets/image/content/black_heart.svg";
import pink_heart from "../../assets/image/content/pink_heart.svg";
import comment from "../../assets/image/content/comment.svg";
import share from "../../assets/image/content/share.svg";

const cn = classNames.bind(styles);

function Comment() {
    const [isFollow, setIsFollow] = useState(false);
    const [isLike, setIsLike] = useState(false);

    function handleChangeFollower() {
        setIsFollow(!isFollow);
    }

    const animations = {
        like: {
            scale: [1, 1.4, 0.8, 1],
        },
        dislike: {},
    };

    return (
        <Modal>
            <div className={cn("wrapper")}>
                <div className={cn("close-btn")}>
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
                            <div className={cn("act-btn")}>
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
                    <div className={cn("comment")}></div>
                    <div className={cn("add-comment")}></div>
                </div>
            </div>
        </Modal>
    );
}

export default Comment;
