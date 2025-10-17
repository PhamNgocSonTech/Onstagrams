exports.generateOTP = () => {
  return Math.floor(Math.random() * 900000 + 100000).toString();
};
