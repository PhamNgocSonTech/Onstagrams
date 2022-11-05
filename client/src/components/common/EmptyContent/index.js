import classNames from "classnames/bind";
import styles from "./EmptyContent.module.scss";

const cn = classNames.bind(styles);

function EmptyContent({ icon, title, ps }) {
    return (
        <div className={cn("empty-content")}>
            <img
                src={icon}
                alt=''
            />
            <h2>{title}</h2>
            <p>{ps}</p>
        </div>
    );
}

export default EmptyContent;
