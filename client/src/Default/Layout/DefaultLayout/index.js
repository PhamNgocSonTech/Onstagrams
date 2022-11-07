import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";

import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import jwt_decode from "jwt-decode";

const cn = classNames.bind(styles);

function DefaultLayout({ children }) {
    // Check logged in to show login section in sidebar
    const token = window.localStorage.getItem("accessToken");
    var idUser = null;
    if (token) {
        idUser = jwt_decode(token)._id;
    }

    return (
        <div className={cn("wrapper")}>
            <Header />
            <div className={cn("container")}>
                {/* Default layout will show sidebar with Suggested Accounts, Following Accounts */}
                <Sidebar
                    followingAccounts={token ? true : false}
                    followerAccounts={false}
                    suggestAcounts
                    isShowLoginSection={token ? false : true}
                    userId={idUser}
                />
                <div className={cn("content")}>{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;
