import classNames from "classnames/bind";
import styles from "./Home.module.scss";

import VideoInfor from "../../components/VideoInfor";

const cn = classNames.bind(styles);

function Home() {
    return (
        <>
            <VideoInfor />
            <VideoInfor />
            <VideoInfor />
            <VideoInfor />
            <VideoInfor />
        </>
    );
}

export default Home;
