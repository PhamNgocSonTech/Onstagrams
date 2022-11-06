import classNames from "classnames/bind";
import styles from "./Alert.module.scss";

const cn = classNames.bind(styles);

function Alert({ leftImage, content, type }) {
    return (
        <div className={cn("wrapper", [type])}>
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
