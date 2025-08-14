const express = require('express');
const authRouter = express.Router();
const { signUpValidator } = require('../utils/signup-validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');

authRouter.post('/signup', async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;

  try {
    signUpValidator(req.body);

    const hash = await bcrypt.hash(password, 10);

    // Always store hash in DB and not password directly
    const userData = new User({
      firstName,
      lastName,
      emailId,
      password: hash,
    });
    await userData.save();

    res.send('Data saved successfully 🚀');
  } catch (err) {
    res.status(400).send("Couldn't save the data successfully " + err);
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    //encrypted
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordCheck = await user.validatePassword(req.body.password);

    if (!passwordCheck) {
      throw new Error('Invalid credentials');
    }

    //in jwt.sign pass a key --- mostly we pass _id from a cluster doc
    const token = await user.getJWT();

    res.cookie('token', token, {
      expires: new Date(Date.now() + 24 * 7 * 3600000), // cookie will be removed after 8 hours
    });
    res.send('User logged in successfully');
  } catch (error) {
    res.status(400).send('ERROR ' + err?.message);
  }
});

authRouter.post('/logout', (req, res) => {
  res.cookie('token', null, { expires: new Date(Date.now()) });

  res.send('User logged out successfully!!!');
});
module.exports = authRouter;
