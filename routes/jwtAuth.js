const expressJwt = require("express-jwt");

const jwtAuth = expressJwt({ secret: 'zheng' }).unless({ path: ["/", "/zheng/user/login", "/zheng/user/register", "/zheng/user/login"] });

module.exports = jwtAuth;



