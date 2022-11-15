import jwt_decode from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPostFromFollowingUsers, getUserById } from "../../utils/HttpRequest/user_request";
import PostInfor from "../../components/PostInfor";
import Toast from "../../components/common/Toast";
import { checkExpiredToken } from "../../utils/CheckExpiredToken/checkExpiredToken";
import { refreshToken } from "../../utils/HttpRequest/auth_request";

function Follow() {
    const negative = useNavigate();
    const [PostData, setPostData] = useState([]);
    const [isShowToast, setIsShowToast] = useState({ isShow: false, message: "" });

    useEffect(() => {
        const getData = async () => {
            let token = localStorage.getItem("accessToken");
            if (token) {
                if (checkExpiredToken(token)) {
                    // Expired token
                    const rt = window.localStorage.getItem("refreshToken");
                    await refreshToken(rt).then((newat) => {
                        token = newat.data.accessToken;
                        window.localStorage.setItem("accessToken", newat.data.accessToken);
                    });
                }
                const currentUserId = jwt_decode(token)._id;
                getPostFromFollowingUsers(currentUserId, token).then((res) => {
                    if (res.status === 304 || res.status === 200) {
                        setPostData(res.data);
                    } else {
                        setIsShowToast({ isShow: true, message: res.data });
                    }
                });
            } else {
                negative("/");
            }
        };

        getData();
    }, []);

    return (
        <>
            {PostData.map((post, index) => {
                return (
                    <PostInfor
                        key={index}
                        postData={post}
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

export default Follow;
