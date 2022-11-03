import axios from "axios";
import { END_POINT_API, END_POINT_API2 } from "../../Default/constant";

const usersConfig = axios.create({
    baseURL: `${END_POINT_API}/users`,
});

const usersConfig2 = axios.create({
    baseURL: `${END_POINT_API2}/user`,
});

/**
 * url: https://localhost:5000/api/user/{url}
 * options: https://localhost:5000/api/user/{url}&{params}
 */
export const getUsers = async (url, options = {}) => {
    const results = await usersConfig.get(url, { params: options });
    return results.data;
};

export const getUsers2 = async () => {
    const results = await usersConfig2.get("/getListUsers/");
    return results.data;
};
