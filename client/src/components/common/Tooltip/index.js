import classNames from "classnames/bind";
import styles from "./Tooltip.module.scss";

import { animate, motion } from "framer-motion";

const cn = classNames.bind(styles);

function Tooltip({ children }) {
    return (
        <motion.div
            className={cn("wrapper")}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
        >
            <div className={cn("arrow-tooltip")}></div>
            {children}
        </motion.div>
    );
}

export default Tooltip;
