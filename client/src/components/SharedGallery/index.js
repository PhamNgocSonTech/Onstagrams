import classNames from "classnames/bind";
import EmptyContent from "../common/EmptyContent";
import styles from "./SharedGallery.module.scss";

import person from "../../assets/image/profile/person.svg";
import PostInfor from "../PostInfor";

const cn = classNames.bind(styles);

function SharedGallery({ isMyProfile = false, contents = [], refreshFunction }) {
    /**
     * contents: [post1, post2, post3,....]
     */
    let m_title = isMyProfile ? "Upload your first post" : "This person doesn't share any post";
    let m_ps = isMyProfile ? "Your post will appear here!" : "Follow and messeage now to see moments each other";

    return contents.length > 0 ? (
        <div className={cn("person-post")}>
            {contents.map((post, index) => (
                <PostInfor
                    key={index}
                    postData={post}
                    refreshFunction={refreshFunction}
                />
            ))}
        </div>
    ) : (
        <EmptyContent
            icon={person}
            title={m_title}
            ps={m_ps}
        ></EmptyContent>
    );
}

export default SharedGallery;
