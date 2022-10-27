import classNames from "classnames/bind";
import styles from "./Home.module.scss";

import VideoInfor from "../../components/VideoInfor";
import PostInfor from "../../components/PostInfor";
import Login from "../../components/Login";

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
            <Login />
        </>
    );
}

export default Home;
