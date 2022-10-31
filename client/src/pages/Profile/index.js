import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import { useState } from "react";

import { PROFILE_TABS } from "../../Default/constant";

import Button from "../../components/common/Button";
import edit from "../../assets/image/profile/edit.svg";
import share from "../../assets/image/profile/share.svg";
import link from "../../assets/image/profile/link.svg";
import person from "../../assets/image/profile/person.svg";
import image from "../../assets/image/profile/image.svg";
import video from "../../assets/image/profile/video.svg";

import EmptyContent from "../../components/common/EmptyContent";
import PhotoGallery from "../../components/PhotoGallery";

import VideoGallery from "../../components/VideoGallery";
import { useRef } from "react";

const cn = classNames.bind(styles);

function Profile() {
    const [tabChoose, setTabChoose] = useState(0);
    const Content = PROFILE_TABS[tabChoose].content;

    const bar = useRef();

    const handleChangeTag = (index) => {
        setTabChoose(index);
    };

    const handleHoverTag = (index) => {
        bar.current.style.left = index * 230 + "px";
    };

    const handleLeaveTag = () => {
        bar.current.style.left = tabChoose * 230 + "px";
    };

    return (
        <div className={cn("wrapper")}>
            <div className={cn("user-infor")}>
                <div className={cn("infor-section")}>
                    <div className={cn("name-infor")}>
                        <img
                            className={cn("avatar")}
                            src='https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tiktok-obj/f0a142d7c5d563cbefbedaf71546e039.jpeg?x-expires=1667350800&x-signature=KrnrSnXsR0G04TIw5dLNP8QxENo%3D'
                            alt=''
                        />
                        <div className={cn("name")}>
                            <h2>pznguyenk1908</h2>
                            <h5>Alex Mine</h5>
                            <Button
                                leftIcon={edit}
                                outline
                                className={cn("profile-button")}
                            >
                                Edit profile
                            </Button>
                        </div>
                    </div>
                    <div className={cn("bio-infor")}>
                        <div className={cn("follow-infor")}>
                            <span className={cn("follow")}>
                                <span className={cn("bold")}>16</span>Following
                            </span>
                            <span className={cn("follow")}>
                                <span className={cn("bold")}>6</span>Followers
                            </span>
                            <span className={cn("follow")}>
                                <span className={cn("bold")}>0</span>Likes
                            </span>
                        </div>
                        <div className={cn("bio")}>
                            <p>Contact: hc19082001@gmail.com</p>
                        </div>
                    </div>
                    <div className={cn("share-link")}>
                        <Button
                            leftIcon={link}
                            href='https://www.facebook.com/pz.hcnguyen.k1908'
                            className={cn("button-link")}
                        >
                            https://www.facebook.com/pz.hcnguyen.k1908
                        </Button>
                    </div>
                </div>
                <img
                    className={cn("share")}
                    src={share}
                    alt=''
                />
            </div>
            <div className={cn("user-gallery")}>
                <div className={cn("tabs")}>
                    {PROFILE_TABS.map((tab, index) =>
                        tab.icon ? (
                            <div
                                key={index}
                                className={cn("tab-item", { highlight: index === tabChoose })}
                                onClick={() => handleChangeTag(index)}
                                onMouseEnter={() => handleHoverTag(index)}
                                onMouseLeave={handleLeaveTag}
                            >
                                <img
                                    src={tab.icon}
                                    alt='icon'
                                />
                                <p>{tab.name}</p>
                            </div>
                        ) : (
                            <div
                                key={index}
                                className={cn("tab-item", { highlight: index === tabChoose })}
                                onClick={() => handleChangeTag(index)}
                                onMouseEnter={() => handleHoverTag(index)}
                                onMouseLeave={handleLeaveTag}
                            >
                                <p>{tab.name}</p>
                            </div>
                        )
                    )}
                    <div
                        className={cn("bar")}
                        ref={bar}
                    ></div>
                </div>

                <div className={cn("content")}>{<Content />}</div>
            </div>
        </div>
    );
}

export default Profile;
