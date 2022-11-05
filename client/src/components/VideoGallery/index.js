import classNames from "classnames/bind";
import EmptyContent from "../common/EmptyContent";
import video from "../../assets/image/profile/video.svg";
import styles from "./VideoGallery.module.scss";

const cn = classNames.bind(styles);

function VideoGallery({ contents = [], isMyProfile = false }) {
    let m_title = isMyProfile ? "Upload your first video" : "This person doesn't have any video";
    let m_ps = isMyProfile ? "Your video will appear here!" : "Follow and messeage now to share moments each other";
    return contents.length > 0 ? (
        <div className={cn("videos")}>
            {contents.map((video, index) => (
                <div
                    className={cn("video")}
                    key={index}
                >
                    <video
                        src={video}
                        controls={true}
                    ></video>
                </div>
            ))}
        </div>
    ) : (
        <EmptyContent
            icon={video}
            title={m_title}
            ps={m_ps}
        />
    );

    //     <div className={cn("videos")}>

    //         <div className={cn("video")}>
    //             <video
    //                 src='https://v16-webapp.tiktok.com/c830bafc24ebd122dbd48781201fc501/635fc160/video/tos/alisg/tos-alisg-pve-0037/24efa522e39b404ea52ddf6a454908b0/?a=1988&ch=0&cr=0&dr=0&lr=tiktok&cd=0%7C0%7C1%7C0&cv=1&br=1858&bt=929&cs=0&ds=3&ft=kLO5qy-gZmo0PvGTfBkVQTDBDiHKJdmC0&mime_type=video_mp4&qs=0&rc=ZDU3ZGc6Z2k2ZjM6aDc8NEBpMzttbDo6ZjU2ZjMzODgzNEBhM182YTIvXi8xNS82Xy8wYSNnNl9wcjRfcGpgLS1kLy1zcw%3D%3D&l=2022103106360801024501106904109E34&btag=80000'
    //                 controls={true}
    //             ></video>
    //         </div>
    //         <div className={cn("video")}>
    //             <video
    //                 src='https://v16-webapp.tiktok.com/c830bafc24ebd122dbd48781201fc501/635fc160/video/tos/alisg/tos-alisg-pve-0037/24efa522e39b404ea52ddf6a454908b0/?a=1988&ch=0&cr=0&dr=0&lr=tiktok&cd=0%7C0%7C1%7C0&cv=1&br=1858&bt=929&cs=0&ds=3&ft=kLO5qy-gZmo0PvGTfBkVQTDBDiHKJdmC0&mime_type=video_mp4&qs=0&rc=ZDU3ZGc6Z2k2ZjM6aDc8NEBpMzttbDo6ZjU2ZjMzODgzNEBhM182YTIvXi8xNS82Xy8wYSNnNl9wcjRfcGpgLS1kLy1zcw%3D%3D&l=2022103106360801024501106904109E34&btag=80000'
    //                 controls={true}
    //             ></video>
    //         </div>
    //         <div className={cn("video")}>
    //             <video
    //                 src='https://v16-webapp.tiktok.com/c830bafc24ebd122dbd48781201fc501/635fc160/video/tos/alisg/tos-alisg-pve-0037/24efa522e39b404ea52ddf6a454908b0/?a=1988&ch=0&cr=0&dr=0&lr=tiktok&cd=0%7C0%7C1%7C0&cv=1&br=1858&bt=929&cs=0&ds=3&ft=kLO5qy-gZmo0PvGTfBkVQTDBDiHKJdmC0&mime_type=video_mp4&qs=0&rc=ZDU3ZGc6Z2k2ZjM6aDc8NEBpMzttbDo6ZjU2ZjMzODgzNEBhM182YTIvXi8xNS82Xy8wYSNnNl9wcjRfcGpgLS1kLy1zcw%3D%3D&l=2022103106360801024501106904109E34&btag=80000'
    //                 controls={true}
    //             ></video>
    //         </div>
    //         <div className={cn("video")}>
    //             <video
    //                 src='https://v16-webapp.tiktok.com/c830bafc24ebd122dbd48781201fc501/635fc160/video/tos/alisg/tos-alisg-pve-0037/24efa522e39b404ea52ddf6a454908b0/?a=1988&ch=0&cr=0&dr=0&lr=tiktok&cd=0%7C0%7C1%7C0&cv=1&br=1858&bt=929&cs=0&ds=3&ft=kLO5qy-gZmo0PvGTfBkVQTDBDiHKJdmC0&mime_type=video_mp4&qs=0&rc=ZDU3ZGc6Z2k2ZjM6aDc8NEBpMzttbDo6ZjU2ZjMzODgzNEBhM182YTIvXi8xNS82Xy8wYSNnNl9wcjRfcGpgLS1kLy1zcw%3D%3D&l=2022103106360801024501106904109E34&btag=80000'
    //                 controls={true}
    //             ></video>
    //         </div>
    //     </div>
    // );
}

// function PhotoGallery({ contents = [] }) {
//     console.log(contents.length);
//     return contents.length > 0 ? (
//         <div className={cn("photos")}>
//             {contents.map((photo, index) => {
//                 return (
//                     <div
//                         className={cn("photo")}
//                         key={index}
//                     >
//                         <img
//                             src={photo}
//                             alt={photo}
//                         />
//                     </div>
//                 );
//             })}
//         </div>
//     ) : (
//         <EmptyContent
//             icon={image}
//             keyword='photo'
//             action='Upload'
//         />
//     );
// }

export default VideoGallery;
