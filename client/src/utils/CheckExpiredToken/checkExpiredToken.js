import jwt_decode from "jwt-decode";

export const checkExpiredToken = (token) => {
    // 0 -> token isn't expired
    // 1 -> token expired
    const decode = jwt_decode(token);
    const expire = decode.exp;
    return expire * 1000 > new Date().getTime() ? false : true;
};
