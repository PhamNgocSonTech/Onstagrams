import classNames from "classnames/bind";
import EmptyContent from "../common/EmptyContent";
import styles from "./SharedGallery.module.scss";

import person from "../../assets/image/profile/person.svg";

const cn = classNames.bind(styles);

function SharedGallery() {
    return (
        <EmptyContent
            icon={person}
            action='Share'
            keyword='moment'
        ></EmptyContent>
    );
}

export default SharedGallery;
