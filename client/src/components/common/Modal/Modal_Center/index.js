import styles from "./Modal_Center.module.scss";
import classNames from "classnames/bind";
import { motion } from "framer-motion";

import Modal from "../../Modal";

const cn = classNames.bind(styles);

function Modal_Center({ children, className, classNameWrapper }) {
    const animations = {
        openForm: {
            scale: [0.6, 1],
        },
        closeForm: {
            scale: [1, 0.6],
        },
    };
    return (
        <Modal
            key={"cut2"}
            className={cn("wrapper", { [classNameWrapper]: classNameWrapper })}
        >
            {/* <div className={cn("modal-form", { [className]: className })}>{children}</div> */}
            <motion.div
                variants={animations}
                animate='openForm'
                transition={{
                    ease: "easeOut",
                    duration: 0.2,
                }}
                className={cn("modal-form", { [className]: className })}
            >
                {children}
            </motion.div>
        </Modal>
    );
}

export default Modal_Center;
