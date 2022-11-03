import axios from "axios";
import { END_POINT_API } from "../../Default/constant";

const usersConfig = axios.create({
    baseURL: `${END_POINT_API}/auth`,
});

/**
 * url: https://localhost:5000/api/auth/{url}
 * options: https://localhost:5000/api/auth/{url}&{params}
 */

export const login = async (body = {}) => {
    const results = await usersConfig.post("/login", { data: body });
    return results.data;
};

export const register = async (options = {}) => {
    const results = await usersConfig.post("/register", { params: options });
    return results.data;
};
