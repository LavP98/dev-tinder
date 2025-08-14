const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://lavnode:XHpS3fxJ6izcxazX@lavnode.tdeti.mongodb.net/devTinder2'
  );
};

module.exports = { connectDB };
