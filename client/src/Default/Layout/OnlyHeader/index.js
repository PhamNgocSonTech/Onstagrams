import classNames from "classnames/bind";
import styles from "./OnlyHeader.module.scss";

import Header from "../../../components/common/Header";

const cn = classNames.bind(styles);

function OnlyHeader({ children }) {
    return (
        <div className={cn("wrapper")}>
            <Header />
            <div className={cn("container")}>
                <div className={cn("content")}>{children}</div>
            </div>
        </div>
    );
}

export default OnlyHeader;
