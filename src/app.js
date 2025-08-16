const express = require('express');

const app = express();

const { connectDB } = require('./config/database');

const cookieParser = require('cookie-parser');

const authRouter = require('./config/routes/auth');

const profileRouter = require('./config/routes/profile');
const requestRouter = require('./config/routes/request');
const userRouter = require('./config/routes/user');

const cors = require('cors');
app.use(
  cors({
    origin: 'http://localhost:7777',
    credentials: true, // Allow credentials like cookies to be sent
  })
);

//request.body is in stream format so we need to create a middleware to parse all incoming requests body to json
app.use(express.json());
//request.cookies is in stream format so we need cookieParser method and it's import as a middleware
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

//First connect to the database and then connect to the server
//If server is listening first and db connection isnt established, app wont work properly
connectDB()
  .then(() => {
    console.log('Database connected successfully');
    app.listen('7777', () => {
      console.log('App is successfully listening on port 7777 🚀');
    });
  })
  .catch(() => {
    console.log("Couldn't connect to the database");
  });

//get all users, use .find model method from mongoose, find({}) will bring in all the users
// app.get('/feed', async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(404).send('Users not found! ' + err);
//   }
// });

// app.get('/user', async (req, res) => {
//   const emailId = req.body.emailId;
//   try {
//     const user = await User.findOne({ emailId: emailId });
//     if (user) {
//       res.send(user);
//     }
//     res.status(404).send('User not found! ' + err);
//   } catch (err) {
//     res.status(404).send('User not found! ' + err);
//   }
// });

// app.get('/userById', async (req, res) => {
//   const id = req.body._id;
//   try {
//     const user = await User.findOne({ _id: id });
//     if (user) {
//       res.send(user);
//     }
//     res.status(404).send('User not found! ' + err);
//   } catch (err) {
//     res.status(404).send('User not found !' + err);
//   }
// });

// app.delete('/user', async (req, res) => {
//   const id = req.body.userId;

//   try {
//     await User.findByIdAndDelete(id);
//     res.send('User deleted successfully');
//   } catch (err) {
//     res.status(404).send('Something went wrong!');
//   }
// });

//update the user by id
//first parameter will be the id and second will be the body
//if we dont have some field in the user schema and we try to pass it, it won't update
// u can also pass options in 3rd parameter, check documentation like returnDocument='before' and all

// `app.patch('/user/:userId', async (req, res) => {
//   const id = req.params?.userId;
//   const data = req.body;
//   try {
//     ALLOWED_UPDATES = ['age', 'gender', 'photoUrl', 'about', 'skills'];
//     const isUpdateAllowed = Object.keys(data).every((key) =>
//       ALLOWED_UPDATES.includes(key)
//     );

//     if (!isUpdateAllowed) {
//       throw new Error('Updates not allowed');
//     }

//     if (data?.skills?.length > 10) {
//       throw new Error('Skills cannot be more than 10');
//     }
//     await User.findByIdAndUpdate(id, req.body, { runValidators: true });
//     res.send('User updated successfully');
//   } catch (err) {
//     res.status(404).send('Update failed!' + err);
//   }
// });

// app.patch('/userByEmailId', async (req, res) => {
//   const emailId = req.body.emailId;
//   try {
//     await User.findOneAndUpdate({ emailId: emailId }, req.body);
//     res.send('User updated successfully!');
//   } catch (err) {
//     res.status.send('Something went wrong!');
//   }
// });`
