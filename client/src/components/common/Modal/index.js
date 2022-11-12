import classNames from "classnames/bind";
import { motion } from "framer-motion";
import styles from "./Modal.module.scss";

const cn = classNames.bind(styles);

function Modal({ children, className }) {
    return (
        <motion.div
            className={cn("wrapper", { [className]: className })}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            {children}
        </motion.div>
    );
}

export default Modal;
