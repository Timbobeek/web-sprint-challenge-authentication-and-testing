const User = require("../users/users-model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../secrets/index"); // use this secret!

const checkUserData = (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    req.userData = { username, password };
    next();
  } else {
    next({ status: 400, message: "username and password required" });
  }
};

const checkUsernameExists = async (req, res, next) => {
  const user = await User.findByUsername(req.userData.username);
  if (user) {
    req.user = user;
    next();
  } else {
    next({ status: 401, message: "invalid credentials" });
  }
};

const buildToken = (user) => {
  const payload = {
    subject: user.user_id,
    role_name: user.role_name,
    username: user.username
  }
  const options = {
    expiresIn: '2d',
  }
  return jwt.sign(payload, JWT_SECRET, options)
}

const checkPassword = async (req, res, next) => {
  if(bcrypt.compareSync(req.body.password, req.user.password)){
    req.token = buildToken(req.user)
    next()
  } else {
    next({status: 401, message: 'invalid credentials'})
  }    
};

module.exports = {
  checkUserData,
  checkUsernameExists,
  checkPassword
}