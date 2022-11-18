import axios from "axios";
import { END_POINT_API2 } from "../../Default/constant";

const usersConfig = axios.create({
    baseURL: `http://localhost:5000/api/post`,
    validateStatus: function (status) {
        return status >= 200 && status <= 500;
    },
});

/**
 * url: https://localhost:5000/api/post/{url}
 * options: https://localhost:5000/api/post/{url}&{params}
 */
export const getListPosts = async () => {
    const results = await usersConfig.get("/getListPosts/");
    return results;
};

export const getPostByIdUser = async (id) => {
    const results = await usersConfig.get(`/getPostUser/${id}`);
    return results.data;
};

export const getPostByIdPost = async (id) => {
    const results = await usersConfig.get(`/getPost/${id}`);
    return results;
};

export const createPost = async (accessToken, data) => {
    const results = await usersConfig.post("/", data, {
        headers: { token: accessToken, Accept: "application/json", "Content-Type": "multipart/form-data" },
    });
    return results;
};

export const editPost = async (accessToken, postId, data) => {
    const results = await usersConfig.put(`/updatePost/${postId}`, data, {
        headers: { token: accessToken, Accept: "application/json", "Content-Type": "multipart/form-data" },
    });
    return results;
};

export const deletePost = async (accessToken, postId) => {
    const results = await usersConfig.delete(`/delete/${postId}`, {
        headers: { token: accessToken },
    });
    return results;
};

// Comment
export const createComment = async (accessToken, postId, cmt) => {
    const results = await usersConfig.put(`/comment/post/${postId}`, cmt, {
        headers: { token: accessToken },
    });
    return results;
};

export const deleteComment = async (postId, cmtId) => {
    const results = await usersConfig.delete(`/delComment/post/${postId}/${cmtId}`);
    return results;
};

// Like + Unlike
export const changeLikeAndUnlikeState = async (accessToken, postId) => {
    const results = await usersConfig.put(
        `/like/${postId}`,
        {},
        {
            headers: { token: accessToken },
        }
    );
    return results;
};
