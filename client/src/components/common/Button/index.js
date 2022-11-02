import styles from "./Button.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

const cn = classNames.bind(styles);

function Button({
    to,
    href,
    children,
    className,
    classNameImg,
    leftIcon,
    onClick,
    onSubmit,
    outlinePrimary,
    disabled,
    primary = false,
    outline = false,
    ...other
}) {
    let Btn = "button";

    let attributes = {
        ...other,
    };

    // Inner Link
    if (to) {
        Btn = Link;
        attributes.to = to;
    }

    // Outer Link
    if (href) {
        Btn = "a";
        attributes.href = href;
    }

    return (
        <Btn
            {...attributes}
            className={cn("wrapper", {
                primary,
                outline,
                outlinePrimary,
                [className]: className,
                disabled: disabled,
            })}
            onClick={onClick}
            onSubmit={onSubmit}
            disabled={disabled}
        >
            {leftIcon && (
                <img
                    src={leftIcon}
                    className={cn({ [classNameImg]: classNameImg })}
                />
            )}
            {children}
        </Btn>
    );
}

export default Button;
