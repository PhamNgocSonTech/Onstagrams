import classNames from "classnames/bind";
import styles from "./Modal.module.scss";

const cn = classNames.bind(styles);

function Modal({ children }) {
    return <div className={cn("wrapper")}>{children}</div>;
}

export default Modal;
