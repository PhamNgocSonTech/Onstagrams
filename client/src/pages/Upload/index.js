import classNames from "classnames/bind";
import styles from "./Upload.module.scss";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";

import upload from "../../assets/image/upload/upload.svg";
import octagon from "../../assets/image/upload/octagon-close-button.svg";
import hashtag from "../../assets/image/upload/hashtag.svg";
import smile from "../../assets/image/upload/smile.svg";
import Button from "../../components/common/Button";
import Login from "../../components/Login";
import { createPost } from "../../utils/HttpRequest/post_request";
import { useNavigate } from "react-router-dom";
import LoadingModal from "../../components/common/LoadingModal";
import jwt_decode from "jwt-decode";
import Toast from "../../components/common/Toast";
import { refreshToken } from "../../utils/HttpRequest/auth_request";
import { checkExpiredToken } from "../../utils/CheckExpiredToken/checkExpiredToken";

const cn = classNames.bind(styles);

function Upload() {
    const [images, setImages] = useState([]);
    const [isShowEmotePicker, setIsShowEmotePicker] = useState(false);
    const [caption, setCaption] = useState("");
    const [hashTag, setHashTag] = useState("");

    const ngt = useNavigate();

    const [isShowLoginForm, setIsShowLoginForm] = useState(false);
    const [isShowLoadingModal, setIsShowLoadingModal] = useState(false);
    const [isShowToast, setIsShowToast] = useState({ check: false, stt: false, message: "" });
    const ref = useRef();
    const htip = useRef();

    const handlePost = async () => {
        // Hanlde Check Login
        let token = window.localStorage.getItem("accessToken");
        if (token) {
            // LOGGED IN

            if (checkExpiredToken(token)) {
                // Expired token
                const rt = window.localStorage.getItem("refreshToken");
                await refreshToken(rt).then((newat) => {
                    token = newat.data.accessToken;
                    window.localStorage.setItem("accessToken", newat.data.accessToken);
                });
            }

            setIsShowLoadingModal(true);
            const frmData = new FormData();
            images.forEach((image) => {
                frmData.append("img", image, image.name);
            });
            frmData.append("desc", caption);
            frmData.append("hashtag", hashTag);
            createPost(token, frmData).then((res) => {
                setIsShowLoadingModal(false);
                if (res.status === 200) {
                    setIsShowToast({ check: true, stt: true, message: "Post Successfully ^^" });
                    setTimeout(() => {
                        ngt(`/profile/${jwt_decode(token)._id}`);
                    }, 1500);
                } else {
                    setIsShowToast({ check: true, stt: false, message: res.data });
                }
                setTimeout(() => {
                    setIsShowToast({ check: false, stt: false, message: "" });
                }, 2500);
            });
        } else {
            // NOT LOG IN => SHOW LOGIN FORM
            setIsShowLoginForm(true);
        }
    };

    const handleChangeImage = (e) => {
        const newfiles = [...e.target.files];
        let filteredItem = [];

        newfiles.forEach((file) => {
            if (
                file.type === "image/jpg" ||
                file.type === "image/png" ||
                file.type === "image/jpeg" ||
                file.type === "image/jpge"
            ) {
                file.url = URL.createObjectURL(file);
                filteredItem.push(file);
            }
        });

        setImages([...images, ...filteredItem]);
        e.target.value = null;
    };

    const handleDeleteItem = (index) => {
        const newArr = [...images];
        newArr.splice(index, 1);
        setImages(newArr);
    };

    const handleToggleEmoteClick = () => {
        setIsShowEmotePicker(!isShowEmotePicker);
    };

    const handleCloseEmotePicker = () => {
        setIsShowEmotePicker(false);
    };

    const handleCaptionChange = (e) => {
        setCaption(e.target.value);
    };

    function handleEmoteClick(emoji) {
        setCaption((pre) => pre + emoji.emoji);
    }

    const handleChangeHashTagInput = (e) => {
        setHashTag(e.target.value);
    };

    const handleAddHashTag = (e) => {
        setHashTag((pre) => pre + "#");
        htip.current.focus();
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
        <div className={cn("wrapper")}>
            <div className={cn("intro")}>
                <h3 style={{ fontSize: "30px" }}>Upload your photos</h3>
                <span style={{ fontSize: "17px", opacity: 0.6 }}>Post the images to your account</span>
            </div>
            <div className={cn("upload-section")}>
                <div className={cn("img-vd-section")}>
                    <div className={cn("img-vd-upload")}>
                        <input
                            type='file'
                            multiple
                            style={{ opacity: 0 }}
                            onChange={handleChangeImage}
                            accept='.jpg, .png, .jpeg, .jpge'
                        />
                        <div className={cn("guide")}>
                            <img
                                src={upload}
                                alt=''
                            />
                            <h3 style={{ opacity: 0.8 }}>Choose/Drop your image here</h3>
                            <ul>
                                <li>Accept .jpg, .png, .jpeg images only</li>
                                <li>Maximum 10 files upload</li>
                            </ul>
                        </div>
                    </div>
                    {images.length > 0 && (
                        <div className={cn("img-vd-show")}>
                            {images.map((image, index) => {
                                if (image.type === "video/mp4") {
                                    return (
                                        <div
                                            className={cn("showed-img")}
                                            key={index}
                                        >
                                            <video
                                                className={cn("img")}
                                                src={image.url}
                                                alt={image.name}
                                                autoPlay={true}
                                                muted={true}
                                                controls={true}
                                            ></video>
                                            <img
                                                className={cn("close")}
                                                onClick={() => handleDeleteItem(index)}
                                                src={octagon}
                                                alt=''
                                            />
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div
                                            className={cn("showed-img")}
                                            key={index}
                                        >
                                            <img
                                                className={cn("img")}
                                                src={image.url}
                                                alt={image.name}
                                            />
                                            <img
                                                className={cn("close")}
                                                src={octagon}
                                                onClick={() => handleDeleteItem(index)}
                                                alt=''
                                            />
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    )}
                </div>
                <div className={cn("cap-upload")}>
                    <div className={cn("hashtag")}>
                        <div className={cn("add-comment")}>
                            <div className={cn("input-field")}>
                                <input
                                    type='text'
                                    placeholder='Add hashtag...'
                                    onChange={handleChangeHashTagInput}
                                    value={hashTag}
                                    ref={htip}
                                />
                                <img
                                    src={hashtag}
                                    alt=''
                                    onClick={handleAddHashTag}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={cn("caption")}>
                        <div className={cn("add-comment")}>
                            <div
                                className={cn("input-field")}
                                ref={ref}
                            >
                                <textarea
                                    className={cn("cap-input")}
                                    placeholder='Hmmmm, What are you thinking about...?'
                                    onFocus={handleCloseEmotePicker}
                                    onChange={handleCaptionChange}
                                    value={caption}
                                ></textarea>
                                <img
                                    src={smile}
                                    alt=''
                                    onClick={handleToggleEmoteClick}
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
                </div>
            </div>
            <div className={cn("submit-section")}>
                <Button outline>Discard</Button>
                <Button
                    primary
                    onClick={handlePost}
                >
                    Post
                </Button>
                {isShowLoginForm && <Login handleClosePanel={setIsShowLoginForm} />}
                {isShowLoadingModal && <LoadingModal />}
                {isShowToast.check && (
                    <Toast
                        state={isShowToast.stt}
                        message={isShowToast.message}
                    />
                )}
            </div>
        </div>
    );
}

export default Upload;
