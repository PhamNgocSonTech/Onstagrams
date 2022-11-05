import classNames from "classnames/bind";
import styles from "./PhotoGallery.module.scss";

import EmptyContent from "../common/EmptyContent";
import image from "../../assets/image/profile/image.svg";

const cn = classNames.bind(styles);

function PhotoGallery({ contents = [], isMyProfile = false }) {
    let m_title = isMyProfile ? "Upload your first photo" : "This person doesn't have any photos";
    let m_ps = isMyProfile ? "Your photo will appear here!" : "Follow and messeage now to share moments each other";
    return contents.length > 0 ? (
        <div className={cn("photos")}>
            {contents.map((photo, index) => {
                return (
                    <div
                        className={cn("photo")}
                        key={index}
                    >
                        <img
                            src={photo}
                            alt={photo}
                        />
                    </div>
                );
            })}
        </div>
    ) : (
        <EmptyContent
            icon={image}
            title={m_title}
            ps={m_ps}
        />
    );
}

// function PhotoGallery() {
//     return (
//         <EmptyContent
//             icon={image}
//             keyword='photo'
//             action='Upload'
//         />
//     );
// }

export default PhotoGallery;
