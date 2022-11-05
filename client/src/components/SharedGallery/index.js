import classNames from "classnames/bind";
import EmptyContent from "../common/EmptyContent";
import styles from "./SharedGallery.module.scss";

import person from "../../assets/image/profile/person.svg";

const cn = classNames.bind(styles);

function SharedGallery({ isMyProfile = false }) {
    let m_title = isMyProfile ? "Share your first photo" : "This person doesn't share any moment";
    let m_ps = isMyProfile ? "Your moments will appear here!" : "Follow and messeage now to see moments each other";
    return (
        <EmptyContent
            icon={person}
            title={m_title}
            ps={m_ps}
        ></EmptyContent>
    );
}

export default SharedGallery;
