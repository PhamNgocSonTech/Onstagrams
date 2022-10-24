import classNames from "classnames/bind";

import styles from "./FrameRecommendVideo.module.scss";

const cn = classNames.bind(styles);

function FrameRecommendVideo({ children, className }) {
    return (
        <div className={cn("wrapper", { [className]: className })}>
            {children}
        </div>
    );
}

export default FrameRecommendVideo;
