import styles from "./PopUpNotification.module.scss";
import classNames from "classnames/bind";

const cn = classNames.bind(styles);

function PopUpNotification({ children, className }) {
    return <div className={cn("pop-up-noti", [className])}>{children}</div>;
}

export default PopUpNotification;
