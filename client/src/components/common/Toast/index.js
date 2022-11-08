import success from "../../../assets/image/toast/success.svg";
import error from "../../../assets/image/toast/error.svg";
import close from "../../../assets/image/toast/close.svg";
import classNames from "classnames/bind";
import styles from "./Toast.module.scss";
import { Snackbar } from "@mui/material";
import { useState } from "react";

const cn = classNames.bind(styles);

function Toast({ message, time = 2000, state = true }) {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={time}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <div
                className={cn("toast", state ? "success" : "error")}
                onClick={handleClose}
            >
                <img
                    className={cn("stt-icon")}
                    src={state ? success : error}
                    alt=''
                />
                <h4 className={cn("status")}>{message}</h4>
                <img
                    src={close}
                    alt=''
                    className={cn("close-icon")}
                />
            </div>
        </Snackbar>
    );
}

export default Toast;
