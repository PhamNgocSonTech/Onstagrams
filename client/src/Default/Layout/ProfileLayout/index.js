import classNames from "classnames/bind";
import styles from "./ProfileLayout.module.scss";

import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";

const cn = classNames.bind(styles);

function ProfileLayout({ children }) {
    return (
        <div className={cn("wrapper")}>
            <Header />
            <div className={cn("container")}>
                <Sidebar
                    className={cn("sidebar-custom")}
                    isShowPopUp={false}
                    followerAccounts={true}
                    followingAccounts={true}
                    suggestAcounts={false}
                />
                <div className={cn("content")}>{children}</div>
            </div>
        </div>
    );
}

export default ProfileLayout;
