import classNames from "classnames/bind";
import styles from "./EditProfile.module.scss";

import Modal_Center from "../common/Modal/Modal_Center";
import Button from "../common/Button";
import close from "../../assets/image/modal/close-dark.svg";
import pencil from "../../assets/image/edit/pencil.svg";
import { useState } from "react";

const cn = classNames.bind(styles);

function EditProfile({ setIsOpenEditPopUp }) {
    const [image, setImage] = useState(
        "https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tiktok-obj/f0a142d7c5d563cbefbedaf71546e039.jpeg?x-expires=1667350800&x-signature=KrnrSnXsR0G04TIw5dLNP8QxENo%3D"
    );

    const handleChangeImage = (e) => {
        const upload_img = e.target.files[0];
        if (
            upload_img.type === "image/jpeg" ||
            upload_img.type === "image/jpg" ||
            upload_img.type === "image/png" ||
            upload_img.type === "image/jpge"
        ) {
            setImage(URL.createObjectURL(upload_img));
        }
        e.target.value = null;
    };

    return (
        <Modal_Center className={cn("edit-form")}>
            <div className={cn("wrapper")}>
                <div className={cn("header")}>
                    <h2>Edit your profile</h2>
                    <img
                        src={close}
                        alt=''
                        onClick={() => setIsOpenEditPopUp(false)}
                    />
                </div>
                <div className={cn("body")}>
                    <div className={cn("edit-section")}>
                        <div className={cn("edit-label")}>
                            <p>Profile photo</p>
                        </div>
                        <div className={cn("edit-input")}>
                            <div className={cn("avt-section")}>
                                <img
                                    className={cn("current-avt")}
                                    src={image}
                                    alt=''
                                />
                                <div className={cn("upload-photo")}>
                                    <img
                                        src={pencil}
                                        alt=''
                                    />
                                </div>
                                <input
                                    type='file'
                                    accept='.jpg, .png, .jpeg, .jpge'
                                    onChange={handleChangeImage}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={cn("edit-section")}>
                        <div className={cn("edit-label")}>
                            <p>Username</p>
                        </div>
                        <div className={cn("edit-input")}>
                            <div className={cn("input-un")}>
                                <input
                                    type='text'
                                    value='pznguyenk1908'
                                />
                            </div>
                        </div>
                    </div>
                    <div className={cn("edit-section")}>
                        <div className={cn("edit-label")}>
                            <p>Name</p>
                        </div>
                        <div className={cn("edit-input")}>
                            <div className={cn("input-un")}>
                                <input
                                    type='text'
                                    value='Alex Mine'
                                />
                            </div>
                        </div>
                    </div>
                    <div className={cn("edit-section")}>
                        <div className={cn("edit-label")}>
                            <p>Bio</p>
                        </div>
                        <div className={cn("edit-input")}>
                            <div className={cn("input-un")}>
                                <textarea
                                    className={cn("bio")}
                                    placeholder='Say something about yourself...'
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className={cn("edit-section")}>
                        <div className={cn("edit-label")}>
                            <p>External link</p>
                        </div>
                        <div className={cn("edit-input")}>
                            <div className={cn("input-un")}>
                                <div className={cn("input-un")}>
                                    <input
                                        type='url'
                                        placeholder='External link'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cn("footer")}>
                    <Button
                        outline
                        onClick={() => setIsOpenEditPopUp(false)}
                    >
                        Cancel
                    </Button>
                    <Button primary>Update</Button>
                </div>
            </div>
        </Modal_Center>
    );
}

export default EditProfile;
