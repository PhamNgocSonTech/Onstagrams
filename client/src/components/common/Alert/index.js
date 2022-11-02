import classNames from "classnames/bind";
import styles from "./Alert.module.scss";

const cn = classNames.bind(styles);

function Alert({ leftImage, content }) {
    return (
        <div className={cn("wrapper")}>
            {leftImage && (
                <img
                    src={leftImage}
                    alt='leftImage'
                />
            )}
            <span>{content}</span>
        </div>
    );
}

export default Alert;
