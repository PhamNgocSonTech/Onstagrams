import jwt_decode from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPostFromFollowingUsers, getUserById } from "../../utils/HttpRequest/user_request";
import PostInfor from "../../components/PostInfor";
import Toast from "../../components/common/Toast";
export const FollowRefreshData = createContext();

function Follow() {
    const negative = useNavigate();
    const [PostData, setPostData] = useState([]);
    const [isShowToast, setIsShowToast] = useState({ isShow: false, message: "" });

    const [refreshData, setRefreshData] = useState(false);
    const handleRefreshData = () => {
        setRefreshData(!refreshData);
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
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
    }, [refreshData]);

    return (
        <FollowRefreshData.Provider value={handleRefreshData}>
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
        </FollowRefreshData.Provider>
    );
}

export default Follow;
