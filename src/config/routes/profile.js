const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const user = require('../models/user');

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    const allowedFields = [
      'firstName',
      'lastName',
      'age',
      'skills',
      'about',
      'gender',
      'photoUrl',
    ];

    const userProfile = {};
    allowedFields.forEach((field) => {
      userProfile[field] = user[field];
    });
    res.send(userProfile);
  } catch (err) {
    res.status(400).send('ERROR ' + err?.message);
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    const EDITABLE_FIELDS = [
      'firstName',
      'lastName',
      'age',
      'skills',
      'about',
      'gender',
      'photoUrl',
    ];

    const requestPayloadFields = req.body;

    const isAllowedEdit = Object.keys(requestPayloadFields).every((field) =>
      EDITABLE_FIELDS.includes(field)
    );

    console.log('Before ', requestPayloadFields);
    if (!isAllowedEdit) {
      throw new Error('Update not permitted for certain fields');
    }
    EDITABLE_FIELDS.forEach(
      (field) => (req.user[field] = requestPayloadFields[field])
    );
    console.log('After ', requestPayloadFields);
    await req.user.save(requestPayloadFields);
    res.send(`${req.user?.firstName} your data is updated successfully!!!`);
  } catch (error) {
    res.status(400).send('ERROR: ' + error);
  }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  try {
    if (!req.cookies?.token) {
      throw new Error('Please login to perform this action!');
    }

    const userEnteredCurrentPassword = req.body.currentPassword;
    console.log('currPass', userEnteredCurrentPassword);
    const validPassword = req.user.validatePassword(userEnteredCurrentPassword);

    console.log('before', req.user.password);
    if (!validPassword) {
      throw new Error('Invalid current password');
    }

    const newPassword = req.body.newPassword;
    req.user.password = await bcrypt.hash(newPassword, 10);
    console.log('new', req.body.newPassword);
    await req.user.save();
    console.log(req.user);
    res.send('Password updated successfully');
  } catch (err) {
    res.status(400).send('Error: ' + err);
  }
});

module.exports = profileRouter;
