const expressJwt = require("express-jwt");
const jwtAuth = expressJwt({ secret: 'zheng' }).unless({ path: ["/users/login", "/users/register"] });
module.exports = jwtAuth;