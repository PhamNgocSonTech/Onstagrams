import classNames from "classnames/bind";
import styles from "./EditProfile.module.scss";

import Modal_Center from "../common/Modal/Modal_Center";
import Button from "../common/Button";
import close from "../../assets/image/modal/close-dark.svg";
import pencil from "../../assets/image/edit/pencil.svg";
import { useState } from "react";
import { useSelector } from "react-redux";
import { editUser } from "../../utils/HttpRequest/user_request";
import LoadingModal from "../common/LoadingModal";
import Toast from "../common/Toast";

const cn = classNames.bind(styles);

function EditProfile({ setIsOpenEditPopUp }) {
    const didLogin = useSelector((state) => state.loginState_reducer.user);
    const [image, setImage] = useState(didLogin);
    const [isShowLoading, setIsShowLoading] = useState(false);
    const [isShowToast, setIsShowToast] = useState({ isShow: false, state: true, message: "" });

    /*
     * 0: Username
     * 1: Fullname
     * 2: Bio
     * 3: External
     */
    const [dataAllInputField, setDataAllInputField] = useState([
        didLogin.username,
        didLogin.fullname,
        didLogin.bio ? didLogin.bio : "",
        didLogin.external ? didLogin.external : "",
    ]);

    const handleChangeDataAllFields = (index, event) => {
        let ArrTmp = [...dataAllInputField];
        if (index === 0) {
            ArrTmp[0] = event.target.value;
        }
        if (index === 1) {
            ArrTmp[1] = event.target.value;
        }
        if (index === 2) {
            ArrTmp[2] = event.target.value;
        }
        if (index === 3) {
            ArrTmp[3] = event.target.value;
        }
        setDataAllInputField(ArrTmp);
    };

    const handleChangeImage = (e) => {
        const upload_img = e.target.files[0];
        if (
            upload_img.type === "image/jpeg" ||
            upload_img.type === "image/jpg" ||
            upload_img.type === "image/png" ||
            upload_img.type === "image/jpge"
        ) {
            upload_img.avatar = URL.createObjectURL(upload_img);
            setImage(upload_img);
        }
        e.target.value = null;
    };

    const handleSubmitData = () => {
        setIsShowLoading(true);
        let frmData = new FormData();
        const token = window.localStorage.getItem("accessToken");

        // If have image.size => Edit image
        if (image.size) {
            frmData.append("img", image, image.name);
        }
        frmData.append("username", dataAllInputField[0]);
        frmData.append("fullname", dataAllInputField[1]);
        frmData.append("bio", dataAllInputField[2]);
        frmData.append("external", dataAllInputField[3]);

        editUser(token, didLogin._id, frmData).then((res) => {
            setIsShowLoading(false);
            if (res.status === 200) {
                setIsShowToast({ isShow: true, state: true, message: "Edit user successfully !" });
                setTimeout(() => {
                    window.location.reload(true);
                }, 1500);
            } else {
                setIsShowToast({ isShow: true, state: false, message: res.data });
            }
        });
        console.log(image);
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
                                    src={image.avatar}
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
                                    value={dataAllInputField[0]}
                                    onChange={(e) => handleChangeDataAllFields(0, e)}
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
                                    value={dataAllInputField[1]}
                                    onChange={(e) => handleChangeDataAllFields(1, e)}
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
                                    value={dataAllInputField[2]}
                                    onChange={(e) => handleChangeDataAllFields(2, e)}
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
                                        value={dataAllInputField[3]}
                                        onChange={(e) => handleChangeDataAllFields(3, e)}
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
                    <Button
                        primary
                        onClick={handleSubmitData}
                    >
                        Update
                    </Button>
                </div>
                {isShowLoading && <LoadingModal />}
                {isShowToast.isShow && (
                    <Toast
                        state={isShowToast.state}
                        message={isShowToast.message}
                    />
                )}
            </div>
        </Modal_Center>
    );
}

export default EditProfile;
