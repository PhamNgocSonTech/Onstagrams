import classNames from "classnames/bind";
import styles from "./PhotoGallery.module.scss";

import EmptyContent from "../common/EmptyContent";
import image from "../../assets/image/profile/image.svg";

const cn = classNames.bind(styles);

function PhotoGallery({ contents = [] }) {
    console.log(contents.length);
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
            keyword='photo'
            action='Upload'
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
