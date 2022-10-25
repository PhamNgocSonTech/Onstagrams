import axios from "axios";
import { END_POINT_API } from "../../Default/constant";

const usersConfig = axios.create({
  baseURL: `${END_POINT_API}/users`,
});

/**
 * url: https://630b16fbed18e825164db3b3.mockapi.io/api/tiktok/users/url
 * options: https://630b16fbed18e825164db3b3.mockapi.io/api/tiktok/users/url&{params}
 */
export const getUsers = async (url, options = {}) => {
  const results = await usersConfig.get(url, { params: options });
  return results.data;
};
