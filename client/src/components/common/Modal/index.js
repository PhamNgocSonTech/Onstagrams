import classNames from "classnames/bind";
import styles from "./Modal.module.scss";

const cn = classNames.bind(styles);

function Modal({ children, className }) {
    return (
        <div className={cn("wrapper", { [className]: className })}>
            {children}
        </div>
    );
}

export default Modal;
