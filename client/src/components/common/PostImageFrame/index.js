import classNames from "classnames/bind";
import styles from "./PostImageFrame.module.scss";

import { ImageList, ImageListItem } from "@mui/material";

const cn = classNames.bind(styles);

function PostImageFrame({ imgs, handleOpenComment }) {
  return (
    <div className={cn("imgs-container")}>
      {/* 1 image */}
      {imgs.length === 1 && (
        <ImageList
          variant="quilted"
          sx={{ height: "100%", overflow: "hidden" }}
          cols={1}
          className={cn("img-list")}>
          <ImageListItem>
            <img
              alt=""
              className={cn("video")}
              src={imgs[0].url}
              onClick={() => handleOpenComment(imgs[0].url)}
            />
          </ImageListItem>
        </ImageList>
      )}

      {/* 2, 4 image */}
      {(imgs.length === 2 || imgs.length === 4) && (
        <ImageList
          variant="quilted"
          sx={{ height: "100%", overflow: "hidden" }}
          cols={2}
          gap={15}
          className={cn("img-list")}>
          {imgs.map((image, key) => (
            <ImageListItem key={key}>
              <img
                alt=""
                className={cn("video")}
                src={image.url}
                onClick={() => handleOpenComment(image.url)}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}

      {/* 3 image */}
      {imgs.length === 3 && (
        <div className={cn("three-frames-image")}>
          <div className={cn("first-img")}>
            <img
              alt=""
              className={cn("video")}
              src={imgs[0].url}
              onClick={() => handleOpenComment(imgs[0].url)}
            />
          </div>
          <div className={cn("other-img")}>
            <img
              alt=""
              className={cn("video")}
              src={imgs[1].url}
              onClick={() => handleOpenComment(imgs[1].url)}
            />
            <img
              alt=""
              className={cn("video")}
              src={imgs[2].url}
              onClick={() => handleOpenComment(imgs[2].url)}
            />
          </div>
        </div>
      )}

      {/* > 4 image */}
      {imgs.length > 4 && (
        <ImageList
          variant="quilted"
          sx={{ height: "100%", overflow: "hidden" }}
          cols={2}
          gap={15}
          className={cn("img-list")}>
          {imgs.slice(0, 3).map((image, index) => (
            <ImageListItem key={index}>
              <img
                alt=""
                className={cn("video")}
                src={image.url}
                onClick={() => handleOpenComment(image.url)}
              />
            </ImageListItem>
          ))}
          <ImageListItem className={cn("last-imgs")}>
            <img alt="" className={cn("video")} src={imgs[3].url} />
            <div
              className={cn("excess-img")}
              onClick={() => handleOpenComment(imgs[3].url)}>
              <h1>+{imgs.length - 4}</h1>
            </div>
          </ImageListItem>
        </ImageList>
      )}
    </div>
  );
}

export default PostImageFrame;
