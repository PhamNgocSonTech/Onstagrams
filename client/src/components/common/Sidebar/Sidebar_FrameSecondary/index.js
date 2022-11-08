import classNames from "classnames/bind";
import { useState } from "react";
import { limitShowPerson } from "../../../../utils/LimitShowPerson/limitShowPerson";

import styles from "./Sidebar_FrameSecondary.module.scss";

const cn = classNames.bind(styles);

function Sidebar_DivSecondary({ title, children, className, defaultListUser = [], setDataFunction }) {
    const [count, setCount] = useState(2);

    const handleExpand = () => {
        // console.log(defaultListUser);
        const newList = [...limitShowPerson(defaultListUser, count)];
        setDataFunction(newList);
        setCount((pre) => pre + 1);
    };

    return (
        <div className={cn("frame", { [className]: className })}>
            {title && <p className={cn("title")}>{title}</p>}
            {children}
            {[...limitShowPerson(defaultListUser, count - 1)].length < defaultListUser.length && (
                <p
                    className={cn("expand")}
                    onClick={handleExpand}
                >
                    See more
                </p>
            )}
        </div>
    );
}

export default Sidebar_DivSecondary;
