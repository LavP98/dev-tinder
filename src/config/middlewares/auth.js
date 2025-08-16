const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      //401 means unauthorised
      res.status(401).send('Unauthorized: No token provided');
      return;
    }

    const { id } = jwt.verify(token, 'Devtinder@123');

    if (!id) {
      throw new Error('User not found');
    }

    const user = await User.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err?.message);
  }
};

module.exports = userAuth;
