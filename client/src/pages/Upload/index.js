import classNames from "classnames/bind";
import styles from "./Upload.module.scss";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";

import upload from "../../assets/image/upload/upload.svg";
import octagon from "../../assets/image/upload/octagon-close-button.svg";
import hashtag from "../../assets/image/upload/hashtag.svg";
import smile from "../../assets/image/upload/smile.svg";
import Button from "../../components/common/Button";

const cn = classNames.bind(styles);

function Upload() {
    const [images, setImages] = useState([]);
    const [isShowEmotePicker, setIsShowEmotePicker] = useState(false);
    const [caption, setCaption] = useState("");
    const [hashTag, setHashTag] = useState("");
    const [hashTagArray, setHashTagArray] = useState([]);
    const ref = useRef();
    const htip = useRef();

    const handleChangeImage = (e) => {
        const newfiles = [...e.target.files];
        let filteredItem = [];

        newfiles.forEach((file) => {
            if (
                file.type === "image/jpg" ||
                file.type === "image/png" ||
                file.type === "image/jpeg" ||
                file.type === "video/mp4" ||
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
                <h3 style={{ fontSize: "30px" }}>Upload your videos or photos</h3>
                <span style={{ fontSize: "17px", opacity: 0.6 }}>Post the videos or images to your account</span>
            </div>
            <div className={cn("upload-section")}>
                <div className={cn("img-vd-section")}>
                    <div className={cn("img-vd-upload")}>
                        <input
                            type='file'
                            multiple
                            style={{ opacity: 0 }}
                            onChange={handleChangeImage}
                            accept='.jpg, .png, .jpeg, .jpge, .mp4'
                        />
                        <div className={cn("guide")}>
                            <img
                                src={upload}
                                alt=''
                            />
                            <h3 style={{ opacity: 0.8 }}>Choose/Drop your image or video here</h3>
                            <ul>
                                <li>Accept .jpg, .png, .jpeg images only</li>
                                <li>Video must less than 2 minutes</li>
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
                <Button primary>Post</Button>
            </div>
        </div>
    );
}

export default Upload;
