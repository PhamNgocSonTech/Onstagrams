import styles from "./Popover.module.scss";
import classNames from "classnames/bind";
import { TopPosition } from "../Sidebar";
import { useContext } from "react";

const cn = classNames.bind(styles);

function Popover({ children, className }) {
    const position = useContext(TopPosition);
    console.log(position);
    return (
        <div
            className={cn("wrapper", [className])}
            style={position ? { top: position.top } : {}}
            onMouseLeave={position && position.onMouseLeave}
            onMouseEnter={position && position.onMouseEnter}
        >
            {children}
        </div>
    );
}

export default Popover;
