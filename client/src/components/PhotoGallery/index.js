import classNames from "classnames/bind";
import styles from "./PhotoGallery.module.scss";

import EmptyContent from "../common/EmptyContent";
import image from "../../assets/image/profile/image.svg";
import Comment from "../../components/Comment";
import { useState } from "react";

const cn = classNames.bind(styles);

function PhotoGallery({ contents = [], isMyProfile = false }) {
    /** contents
   *[
        {
        "_id": "636a9a2f41da11eaa44b1b19",
        "desc": "ÁDASD #conan",
        "img": [
            {
                "url": "http://res.cloudinary.com/doapkbncj/image/upload/v1667930671/onstagram_v2/posts/jubaj5wnls13z8o1blyk.jpg",
                ...
            },
            {
                "url": "http://res.cloudinary.com/doapkbncj/image/upload/v1667930671/onstagram_v2/posts/fnlch4ujah75thna9kjw.jpg",
                ...
            },
            {
                "url": "http://res.cloudinary.com/doapkbncj/image/upload/v1667930671/onstagram_v2/posts/ynxmxrcy6rjslyhuoyir.jpg",
                ...
            },
            ...
        ],
        "video": [],
        "userId": "6367b61cf5189c410030d936",
        "likes": [],
        "comments": [],
        "createdAt": "2022-11-08T18:04:31.103Z",
        "updatedAt": "2022-11-08T18:04:31.103Z",
        "__v": 0
        },
        ...
    ]
     */
    const [isShowComment, setIsShowComment] = useState({ isShow: false, data: {} });

    let m_title = isMyProfile ? "Upload your first photo" : "This person doesn't have any photos";
    let m_ps = isMyProfile ? "Your photo will appear here!" : "Follow and messeage now to share moments each other";

    const havePhoto = contents.filter((post) => post.img.length > 0);
    const handleOpenComment = (url, postId) => {
        let dataToComment = [];
        havePhoto.forEach((post) =>
            post.img.forEach((photo) => {
                if (postId === post._id && photo.url === url) {
                    dataToComment.push({
                        postID: post._id,
                        url: photo.url,
                        show: true,
                    });
                } else {
                    dataToComment.push({
                        postID: post._id,
                        url: photo.url,
                    });
                }
            })
        );
        setIsShowComment({ isShow: true, data: dataToComment });
    };

    return havePhoto.length > 0 ? (
        <div className={cn("photos")}>
            {havePhoto.map((post) => {
                return post.img.map((photo, index) => (
                    <div
                        className={cn("photo")}
                        key={index}
                        onClick={() => handleOpenComment(photo.url, post._id)}
                    >
                        <img
                            src={photo.url}
                            alt={photo.url}
                        />
                    </div>
                ));
            })}
            {isShowComment.isShow && (
                <Comment
                    setIsShowComment={setIsShowComment}
                    dataShow={isShowComment.data}
                />
            )}
        </div>
    ) : (
        <EmptyContent
            icon={image}
            title={m_title}
            ps={m_ps}
        />
    );
}

export default PhotoGallery;
