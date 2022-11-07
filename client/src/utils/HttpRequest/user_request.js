import axios from "axios";
import { END_POINT_API, END_POINT_API2 } from "../../Default/constant";

const usersConfig = axios.create({
    baseURL: `${END_POINT_API}/users`,
});

const usersConfig2 = axios.create({
    baseURL: `${END_POINT_API2}/user`,
    validateStatus: function (status) {
        return status >= 200 && status <= 500;
    },
});

// MOCK API
export const getUsers = async (url, options = {}) => {
    const results = await usersConfig.get(url, { params: options });
    return results.data;
};

// LOCAL API
export const getAllUsers = async () => {
    const results = await usersConfig2.get("/getListUsers/");
    return results.data;
};

export const getUserById = async (id) => {
    const results = await usersConfig2.get(`/get/${id}`);
    return results;
};

export const followUserHasId = async (id, accessToken) => {
    const results = await usersConfig2.put(`/${id}/follow`, {}, { headers: { token: accessToken } });
    return results;
};

export const unfollowUserHasId = async (id, accessToken) => {
    const results = await usersConfig2.put(`/${id}/unfollow`, {}, { headers: { token: accessToken } });
    return results;
};

export const getFollowersOfUser = async (id) => {
    const results = await usersConfig2.get(`/getUserFollowers/${id}`);
    return results.data;
};

export const getFollowingsOfUser = async (id) => {
    const results = await usersConfig2.get(`/getUserFollowings/${id}`);
    return results.data;
};
