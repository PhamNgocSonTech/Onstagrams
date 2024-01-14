import { Skeleton } from "@mui/material";

import classNames from "classnames/bind";
import styles from "./PostInforSkeleton.module.scss";
const cn = classNames.bind(styles);

function PostInforSkeleton() {
  return (
    <div className={cn("wrapper")}>
      <Skeleton variant="circular" width={60} height={60} />
      <div>
        <Skeleton variant="text" width="30%" sx={{ fontSize: "2rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
        <Skeleton variant="rectangular" width={650} height={300} />
      </div>

      <hr />
    </div>
  );
}

export default PostInforSkeleton;
