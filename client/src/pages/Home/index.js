import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../../components/common/Toast";
import PostInfor from "../../components/PostInfor";
import { getListPosts } from "../../utils/HttpRequest/post_request";
import styles from "./Home.module.scss";

const cn = classNames.bind(styles);

function Home() {
    const negative = useNavigate();
    const [PostData, setPostData] = useState([]);
    const [isShowToast, setIsShowToast] = useState({ isShow: false, message: "" });
    const [refreshData, setRefreshData] = useState(false);

    const refreshFunction = () => {
        setRefreshData(!refreshData);
    };

    useEffect(() => {
        const getData = async () => {
            getListPosts().then((res) => {
                if (res.status === 304 || res.status === 200) {
                    setPostData(res.data);
                } else {
                    setIsShowToast({ isShow: true, message: res.data });
                }
            });
        };
        getData();
    }, [refreshData]);

    return (
        <>
            {PostData.map((post, index) => {
                return (
                    <PostInfor
                        key={index}
                        postData={post}
                        refreshFunction={refreshFunction}
                    />
                );
            })}
            {isShowToast.isShow && (
                <Toast
                    state={false}
                    message={isShowToast.message}
                />
            )}
        </>
    );
}

export default Home;
