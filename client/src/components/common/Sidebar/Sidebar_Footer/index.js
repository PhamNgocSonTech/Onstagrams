import classNames from "classnames/bind";

import styles from "./Sidebar_Footer.module.scss";
import { FOOTER } from "../../../../Default/constant";
import DivLinkContainer from "./DivLinkContainer";

const cn = classNames.bind(styles);

function Sidebar_Footer() {
    return (
        <div>
            {FOOTER.map((section, index) => (
                <DivLinkContainer key={index} list={section} />
            ))}
            <footer className={cn("copyright")}>© 2022 TikTok</footer>
        </div>
    );
}

export default Sidebar_Footer;
