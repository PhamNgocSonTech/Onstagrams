import classNames from "classnames/bind";
import styles from "./LoadingModal.module.scss";

import loading from "./../../../assets/image/loading.gif";

const cn = classNames.bind(styles);

function LoadingModal() {
    return (
        <div className={cn("wrapper")}>
            <img
                src={loading}
                alt=''
            />
        </div>
    );
}

export default LoadingModal;
