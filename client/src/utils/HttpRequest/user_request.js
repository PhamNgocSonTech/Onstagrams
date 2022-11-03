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

/**
 * url: https://localhost:5000/api/user/{url}
 * options: https://localhost:5000/api/user/{url}&{params}
 */
export const getUsers = async (url, options = {}) => {
    const results = await usersConfig.get(url, { params: options });
    return results.data;
};

export const getAllUsers = async () => {
    const results = await usersConfig2.get("/getListUsers/");
    return results.data;
};

export const getUserById = async (id) => {
    const results = await usersConfig2.get(`/get/${id}`);
    return results;
};
