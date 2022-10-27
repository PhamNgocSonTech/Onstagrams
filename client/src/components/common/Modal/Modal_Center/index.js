import styles from "./Modal_Center.module.scss";
import classNames from "classnames/bind";

import Modal from "../../Modal";

const cn = classNames.bind(styles);

function Modal_Center({ children, className }) {
    return (
        <Modal className={cn("wrapper")}>
            <div className={cn("modal-form", { [className]: className })}>
                {children}
            </div>
        </Modal>
    );
}

export default Modal_Center;
