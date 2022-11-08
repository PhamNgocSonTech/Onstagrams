import axios from "axios";
import { END_POINT_API2 } from "../../Default/constant";

const usersConfig = axios.create({
    baseURL: `${END_POINT_API2}/post`,
    validateStatus: function (status) {
        return status >= 200 && status <= 500;
    },
});

/**
 * url: https://localhost:5000/api/post/{url}
 * options: https://localhost:5000/api/post/{url}&{params}
 */
export const getAllPost = async (url, options = {}) => {};

export const getPostByIdUser = async (id) => {
    const results = await usersConfig.get(`/getPost/${id}`);
    return results.data;
};

export const createPost = async (accessToken, data) => {
    const results = await usersConfig.post("/", data, {
        headers: { token: accessToken, Accept: "application/json", "Content-Type": "multipart/form-data" },
    });
    return results;
};
