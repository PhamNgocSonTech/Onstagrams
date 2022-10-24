import axios from "axios";
import { END_POINT_API } from "../../Default/constant";

const usersConfig = axios.create({
    baseURL: `${END_POINT_API}/users`
});

export const getUsers = async (url, options = {}) => {
    const results = await usersConfig.get(url, { params: options });
    return results.data;
};
