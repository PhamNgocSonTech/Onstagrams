exports.generateOTP = () => {
    let otp = '';
    let n = 6
        for (let i = 0; i <= n; i++) {
                  let randomCode = Math.floor(Math.random()*90000) + 10000
                  otp =+ randomCode;
        }
    return otp;
}