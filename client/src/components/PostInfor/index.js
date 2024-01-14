import classNames from "classnames/bind";
import styles from "./PostInfor.module.scss";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PostImageFrame from "../common/PostImageFrame";
import moment from "moment";

import Button from "../../components/common/Button";
import Comment from "../Comment";
import more from "../../assets/image/comment/more.svg";

import black_heart from "../../assets/image/content/black_heart.svg";
import pink_heart from "../../assets/image/content/pink_heart.svg";
import comment from "../../assets/image/content/comment.svg";
import share from "../../assets/image/content/share.svg";

import { useSelector } from "react-redux";
import Login from "../Login";
import { getUserById } from "../../utils/HttpRequest/user_request";

import FrameRecommendVideo from "../common/FrameRecommendVideo";
import Popover from "../common/Popover";
import Modal_Center from "../common/Modal/Modal_Center";
import jwt_decode from "jwt-decode";
import {
  changeLikeAndUnlikeState,
  deletePost,
} from "../../utils/HttpRequest/post_request";
import Toast from "../common/Toast";
import LoadingModal from "../common/LoadingModal";
import { useNavigate } from "react-router-dom";
import { checkExpiredToken } from "../../utils/CheckExpiredToken/checkExpiredToken";
import { refreshToken } from "../../utils/HttpRequest/auth_request";
import PostInforSkeleton from "../../skeletons/PostInforSkeleton";

const cn = classNames.bind(styles);

function PostInfor({ postData = {}, refreshFunction }) {
  const [isUnderlineUsername, setIsUnderlineUsername] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [isShowPanel, setIsShowPanel] = useState(false);
  const [isShowComment, setIsShowComment] = useState({
    isShow: false,
    data: {},
  });
  const [isShowLoginForm, setIsShowLoginForm] = useState(false);
  const [isMyAccount, setIsMyAccount] = useState(() => {
    const token = window.localStorage.getItem("accessToken");
    if (token) {
      if (jwt_decode(token)._id === postData.userId) {
        return true;
      }
    } else {
      return false;
    }
  });
  const [dataUser, setDataUser] = useState({});

  const [isOpenFormDelete, setIsOpenFormDelete] = useState(false);
  const [isOpenAcceptDeleteOption, setIsOpenAcceptDeleteOption] =
    useState(false);

  const [isGetAPIDone, setIsGetAPIDone] = useState(false);
  const [isShowToast, setIsShowToast] = useState({
    isShow: false,
    type: false,
    message: "",
  });

  const [isShowLoadingModal, setIsShowLoadingModal] = useState(false);

  const [currentRefreshFunc, setCurrentRefreshFunc] = useState(false);

  function handleRefreshCurrent() {
    setCurrentRefreshFunc(!currentRefreshFunc);
  }

  const negative = useNavigate();

  const ref = useRef();

  const handleOpenComment = (url) => {
    const dataToComment = [];
    postData.img.forEach((img) => {
      if (img.url === url) {
        dataToComment.push({
          postID: postData._id,
          url: img.url,
          show: true,
        });
      } else {
        dataToComment.push({
          postID: postData._id,
          url: img.url,
        });
      }
    });
    setIsShowComment({ isShow: true, data: dataToComment });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpenAcceptDeleteOption(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    getUserById(postData.userId).then((user) => {
      setDataUser(user.data);
      setIsGetAPIDone(true);
    });

    const token = window.localStorage.getItem("accessToken");
    if (token) {
      console.log(postData);
      postData.likes.filter((iduser) => iduser === jwt_decode(token)._id)
        .length > 0
        ? setIsLike(true)
        : setIsLike(false);
    }
  }, [currentRefreshFunc]);

  const didLogin = useSelector((state) => state.loginState_reducer.user);

  async function handleDeletePost() {
    setIsShowLoadingModal(true);
    let token = window.localStorage.getItem("accessToken");

    if (checkExpiredToken(token)) {
      // Expired token
      const rt = window.localStorage.getItem("refreshToken");
      await refreshToken(rt).then((newat) => {
        token = newat.data.accessToken;
        window.localStorage.setItem("accessToken", newat.data.accessToken);
      });
    }

    deletePost(token, postData._id).then(async (res) => {
      setIsShowLoadingModal(false);
      if (res.status === 200 || res.status === 304) {
        setIsShowToast({
          isShow: true,
          type: true,
          message: "Deleted successfully !",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setIsShowToast({ isShow: true, type: false, message: res.data });
      }
    });
  }

  const animations = {
    like: {
      scale: [1, 1.4, 0.8, 1],
    },
    dislike: {},
  };

  function handleChangeToProfile(id) {
    negative(`/profile/${id}`);
  }

  function handleMouseHoverAvt() {
    setIsUnderlineUsername(true);
  }

  function handleMouseLeaveAvt() {
    setIsUnderlineUsername(false);
  }

  function handleLike() {
    const token = window.localStorage.getItem("accessToken");
    if (token) {
      // Handle like/unlike
      changeLikeAndUnlikeState(token, postData._id).then((res) => {
        refreshFunction();
        setIsLike(!isLike);
      });
    } else {
      // Force login
      setIsShowLoginForm(true);
    }
  }

  function handleChangeFollower() {
    setIsFollow(!isFollow);
  }

  function handleOpenCommentSection() {
    //setIsShowPanel(true);
    const dataToComment = [];
    postData.img.forEach((img, index) => {
      if (index === 0) {
        dataToComment.push({
          postID: postData._id,
          url: img.url,
          show: true,
        });
      } else {
        dataToComment.push({
          postID: postData._id,
          url: img.url,
        });
      }
    });
    setIsShowComment({ isShow: true, data: dataToComment });
  }

  const Content = (
    <FrameRecommendVideo className={cn("wrapper")}>
      <img
        className={cn("avatar")}
        onClick={() => handleChangeToProfile(dataUser._id)}
        alt="avt"
        src={dataUser.avatar}
        onMouseEnter={handleMouseHoverAvt}
        onMouseLeave={handleMouseLeaveAvt}
      />

      <div className={cn("details")}>
        <div className={cn("author")}>
          <h3
            className={cn("username", {
              active: isUnderlineUsername,
            })}
            onClick={() => handleChangeToProfile(dataUser._id)}>
            {dataUser.username}
          </h3>
          <h4
            className={cn("name")}
            onMouseEnter={handleMouseHoverAvt}
            onMouseLeave={handleMouseLeaveAvt}
            onClick={() => handleChangeToProfile(dataUser._id)}>
            {dataUser.fullname}
          </h4>
          <span className={cn("time")}>
            - {moment(postData.createdAt).fromNow()}
          </span>
        </div>
        <div className={cn("video-des")}>
          <span className={cn("cap")}>{postData.desc} </span>
          {postData.hashtag &&
            postData.hashtag.split(" ").map((ht, index) => (
              <Button key={index} className={cn("hashtag")}>
                {ht}
              </Button>
            ))}
        </div>
        <div className={cn("video-container")}>
          <PostImageFrame
            imgs={postData.img}
            handleOpenComment={handleOpenComment}
          />
          <div className={cn("actions")}>
            <div className={cn("action")}>
              <div className={cn("act-btn")} onClick={handleLike}>
                <motion.img
                  alt="img"
                  variants={animations}
                  whileHover={{ rotate: ["0", "-45deg", "45deg", "0deg"] }}
                  src={isLike ? pink_heart : black_heart}
                  animate={isLike ? "like" : "dislike"}
                />
              </div>
              <span className={cn("act-text")}>{postData.likes.length}</span>
            </div>
            <div className={cn("action")}>
              <div className={cn("act-btn")} onClick={handleOpenCommentSection}>
                <motion.img
                  alt="img"
                  src={comment}
                  whileHover={{ rotate: ["0", "-45deg", "45deg", "0deg"] }}
                />
              </div>
              <span className={cn("act-text")}>{postData.comments.length}</span>
            </div>
            <div className={cn("action")}>
              <div className={cn("act-btn")}>
                <motion.img
                  alt="img"
                  src={share}
                  whileHover={{ rotate: ["0", "-45deg", "45deg", "0deg"] }}
                />
              </div>
              <span className={cn("act-text")}>0</span>
            </div>
          </div>
        </div>
      </div>

      {isMyAccount && (
        <>
          <div className={cn("more-btn")} ref={ref}>
            <img
              src={more}
              alt=""
              onClick={() =>
                setIsOpenAcceptDeleteOption(!isOpenAcceptDeleteOption)
              }
            />
            {isOpenAcceptDeleteOption && (
              <Popover className={cn("delete-post")}>
                <Button
                  outline
                  className={cn("btn-option", "btn-2")}
                  onClick={() => {
                    setIsOpenAcceptDeleteOption(false);
                    setIsOpenFormDelete(true);
                  }}>
                  Delete this post
                </Button>
              </Popover>
            )}
            {isOpenFormDelete && (
              <Modal_Center className={cn("accept-delete-form")}>
                <h2>Are you sure to delete this post ? </h2>
                <div className={cn("accept-btns")}>
                  <Button
                    className={cn("accept-btn")}
                    outlinePrimary
                    onClick={() => {
                      setIsOpenFormDelete(false);
                    }}>
                    No
                  </Button>
                  <Button
                    className={cn("accept-btn")}
                    outlinePrimary
                    onClick={handleDeletePost}>
                    Yes
                  </Button>
                </div>
              </Modal_Center>
            )}
          </div>
        </>
      )}

      <AnimatePresence>
        {isShowLoginForm && <Login handleClosePanel={setIsShowLoginForm} />}
      </AnimatePresence>
      {isShowComment.isShow && (
        <Comment
          setIsShowComment={setIsShowComment}
          dataShow={isShowComment.data}
          refreshFunction={refreshFunction}
          refreshPostInforFunction={handleRefreshCurrent}
        />
      )}

      {isShowLoadingModal && <LoadingModal />}
      {isShowToast.isShow && (
        <Toast state={isShowToast.type} message={isShowToast.message} />
      )}
    </FrameRecommendVideo>
  );

  return isGetAPIDone ? Content : <PostInforSkeleton />;
}

export default PostInfor;
