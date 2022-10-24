import classNames from "classnames/bind";

import styles from "./Sidebar_FrameSecondary.module.scss";

const cn = classNames.bind(styles);

function Sidebar_DivSecondary({ title, children, seeall }) {
    return (
        <div className={cn("frame")}>
            {title && <p className={cn("title")}>{title}</p>}
            {children}
            {seeall && <p className={cn("expand")}>See all</p>}
        </div>
    );
}

export default Sidebar_DivSecondary;
