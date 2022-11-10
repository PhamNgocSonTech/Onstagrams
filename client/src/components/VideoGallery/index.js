import classNames from "classnames/bind";
import EmptyContent from "../common/EmptyContent";
import video from "../../assets/image/profile/video.svg";
import styles from "./VideoGallery.module.scss";

const cn = classNames.bind(styles);

function VideoGallery({ contents = [], isMyProfile = false }) {
    let m_title = isMyProfile ? "Upload your first video" : "This person doesn't have any video";
    let m_ps = isMyProfile ? "Your video will appear here!" : "Follow and messeage now to share moments each other";
    const haveVideo = contents.filter((post) => post.video.length > 0);

    return haveVideo.length > 0 ? (
        <div className={cn("videos")}>
            {haveVideo.map((post) =>
                post.video.map((video, index) => (
                    <div
                        className={cn("video")}
                        key={index}
                    >
                        <video
                            src={video.url}
                            controls={true}
                        ></video>
                    </div>
                ))
            )}
        </div>
    ) : (
        <EmptyContent
            icon={video}
            title={m_title}
            ps={m_ps}
        />
    );
}

export default VideoGallery;
