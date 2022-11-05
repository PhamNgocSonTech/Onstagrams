exports.generateOTP = () => {
    let otp = '';
    for (let i = 0; i <= 3; i++) {
              let randomCode = Math.round(Math.random() * 9);
              otp =+ randomCode;
    }
    return otp;
}