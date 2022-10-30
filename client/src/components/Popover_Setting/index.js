import classNames from "classnames/bind";
import styles from "./Popover_Setting.module.scss";

import Button from "../common/Button";
import Popover from "../common/Popover";

import { useState } from "react";

import Header_Popover_Setting from "./Header_Popover_Setting";

import logout from "../../assets/image/header/logout.svg";
import white_up_arrow from "../../assets/image/header/white_up_arrow.svg";

const cn = classNames.bind(styles);

function Popover_Setting({ menu, logIn = false, onHandleLogOut }) {
    const [StandIn, setStandIn] = useState([{ list: menu }]);
    const current = StandIn[StandIn.length - 1];

    const handleClick = (item) => {
        if (item.sub_menu) {
            setStandIn([...StandIn, item.sub_menu]);
        }
    };
    const handleBack = () => {
        setStandIn((pre) => {
            return pre.slice(0, pre.length - 1);
        });
    };

    return (
        <div className={cn("wrapper")}>
            <img
                src={white_up_arrow}
                className={cn("arrow-popover")}
            />
            <Popover className={cn("pop-item")}>
                {StandIn.length > 1 && (
                    // eslint-disable-next-line react/jsx-pascal-case
                    <Header_Popover_Setting
                        title={current.title}
                        onClick={handleBack}
                        className={cn("header")}
                    />
                )}
                <div className={cn("container")}>
                    {current.list.map((item, index) => (
                        <Button
                            key={index}
                            className={cn("but-item", {
                                logout: item.divideBar,
                            })}
                            leftIcon={item.icon}
                            to={item.to}
                            href={item.href}
                            onClick={() => handleClick(item)}
                        >
                            {item.option}
                        </Button>
                    ))}
                </div>

                {logIn && StandIn.length === 1 && (
                    <Button
                        className={cn("but-item", "logout")}
                        leftIcon={logout}
                        onClick={onHandleLogOut}
                        to='/'
                    >
                        Log out
                    </Button>
                )}
            </Popover>
        </div>
    );
}

export default Popover_Setting;
