const validator = require('validator');

const signUpValidator = (req) => {
  const { firstName, lastName, emailId, password } = req;

  if (!validator.isEmail(emailId)) {
    throw new Error('Invalid emailID entered ' + emailId);
  }

  if (!firstName || !lastName) {
    throw new Error('First or Lastname name cannot be empty ');
  }

  if (firstName.length < 2 || firstName.length > 50) {
    throw new Error('Please enter a first name ' + firstName);
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error('Please enter a strong password');
  }
};

module.exports = { signUpValidator };
