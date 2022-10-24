import classNames from "classnames/bind";
import styles from "./Popover_Search.module.scss";
import AccountItem from "../AccountItem";
import Popover from "../common/Popover";
import { USERS } from "../../Default/constant";

const cn = classNames.bind(styles);

function Popover_Search({ listdata }) {
    console.log(listdata);
    return (
        <div className={cn("popover")}>
            <Popover>
                <p className={cn("pop-label")}>Accounts</p>
                {listdata.map((user) => (
                    <AccountItem userInfor={user} key={user.id} />
                ))}
            </Popover>
        </div>
    );
}

export default Popover_Search;
