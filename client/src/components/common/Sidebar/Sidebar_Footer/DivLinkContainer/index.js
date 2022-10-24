import classNames from "classnames/bind";

import styles from "./DivLinkContainer.module.scss";

import Button from "../../../Button";

const cn = classNames.bind(styles);

function DivLinkContainer({ list }) {
    return (
        <div className={cn("wrapper")}>
            {list.map((title, index) => (
                <Button
                    className={cn("ft-btn")}
                    key={index}
                    href={title.href}
                    to={title.to}
                >
                    {title.title}
                </Button>
            ))}
        </div>
    );
}

export default DivLinkContainer;
