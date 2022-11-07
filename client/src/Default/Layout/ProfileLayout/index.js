import classNames from "classnames/bind";
import styles from "./ProfileLayout.module.scss";

import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";

const cn = classNames.bind(styles);

function ProfileLayout({ children }) {
    const token = window.localStorage.getItem("accessToken");
    var id = null;
    if (token) {
        id = jwt_decode(token)._id;
    }
    return (
        <div className={cn("wrapper")}>
            <Header />
            <div className={cn("container")}>
                <Sidebar
                    className={cn("sidebar-custom")}
                    isShowPopUp={false}
                    followerAccounts={token ? true : false}
                    followingAccounts={token ? true : false}
                    suggestAcounts={token ? false : true}
                    isShowLoginSection={token ? false : true}
                    userId={id}
                />
                <div className={cn("content")}>{children}</div>
            </div>
        </div>
    );
}

export default ProfileLayout;
