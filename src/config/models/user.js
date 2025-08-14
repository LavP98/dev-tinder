const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      validate(email) {
        if (!validator.isEmail(email)) {
          throw new Error('Invalid Email ' + email);
        }
      },
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      validate(password) {
        if (!validator.isStrongPassword(password)) {
          throw new Error('Please enter a strong password ' + password);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      //c
      //Validate will only work for new fields that will be added
      //In order to amke it work for Patch, add options for validation in post request
      validate(gender) {
        if (!['male', 'female', 'others'].includes(gender)) {
          throw new Error('Invalid gender, please add correct gender');
        }
      },
    },
    photoUrl: {
      validate(url) {
        if (!validator.isURL(url)) {
          throw new Error('Invalid URL ' + url);
        }
      },
      type: String,
      //add a default photourl
      //c
      default:
        'https://i.pinimg.com/736x/9f/16/72/9f1672710cba6bcb0dfd93201c6d4c00.jpg',
    },
    about: {
      type: String,
      default: 'This is a default about thatw e keep for a user',
      //add a default
      //c
    },
    skills: {
      type: [String],
      //c
    },
  },
  {
    timestamps: true,
  }
);

//always declare function using function keyword for this kinda usecase
userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({ id: this._id }, 'Devtinder@123', {
    expiresIn: '1d',
  });

  return token;
};

userSchema.methods.validatePassword = async function (userEnteredPassword) {
  isPasswordValidated = await bcrypt.compare(
    userEnteredPassword,
    this.password
  );

  return isPasswordValidated;
};

module.exports = mongoose.model('User', userSchema);
