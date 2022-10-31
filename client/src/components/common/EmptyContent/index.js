import classNames from "classnames/bind";
import styles from "./EmptyContent.module.scss";

const cn = classNames.bind(styles);

function EmptyContent({ icon, action, keyword }) {
    return (
        <div className={cn("empty-content")}>
            <img
                src={icon}
                alt=''
            />
            <h2>
                {action} your first {keyword}
            </h2>
            <p>Your {keyword} will appear here</p>
        </div>
    );
}

export default EmptyContent;
