import styles from "./AccountItem.module.scss";
import classNames from "classnames/bind";
import check from "../../assets/image/header/check.svg";
import { useNavigate } from "react-router-dom";

const cn = classNames.bind(styles);

function AccountItem({ bold, smdes, userInfor, onMouseEnter, onMouseLeave }) {
    const negative = useNavigate();
    const handleDirectToProfile = () => {
        negative(`/profile/${userInfor._id}`);
    };
    return (
        <div
            className={cn("account")}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={() => handleDirectToProfile()}
        >
            <img
                src={userInfor.avatar}
                alt={`${userInfor.username}`}
                className={cn("avt")}
            />
            <div className={cn("infor")}>
                <h4 className={cn({ bold })}>
                    {userInfor.username}
                    {userInfor.badge && (
                        <img
                            src={check}
                            alt='img'
                        />
                    )}
                </h4>
                <p className={cn({ smdes })}>{userInfor.fullname}</p>
            </div>
        </div>
    );
}

export default AccountItem;
