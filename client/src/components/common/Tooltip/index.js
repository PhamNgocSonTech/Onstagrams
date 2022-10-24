import classNames from "classnames/bind";
import styles from "./Tooltip.module.scss";

const cn = classNames.bind(styles);

function Tooltip({ children }) {
    return (
        <div className={cn("wrapper")}>
            <div className={cn("arrow-tooltip")}></div>
            {children}
        </div>
    );
}

export default Tooltip;
