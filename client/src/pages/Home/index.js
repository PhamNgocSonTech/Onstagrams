import classNames from "classnames/bind";
import styles from "./Home.module.scss";

import VideoInfor from "../../components/VideoInfor";
import PostInfor from "../../components/PostInfor";
import Comment from "../../components/Comment";

const cn = classNames.bind(styles);

function Home() {
    return (
        <>
            <VideoInfor />
            <PostInfor />
            <VideoInfor />
            <PostInfor />
            <VideoInfor />
            <VideoInfor />
            <PostInfor />
        </>
    );
}

export default Home;
