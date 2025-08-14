const express = require('express');
const userRouter = express.Router();
const userAuth = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requestsReceived = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', 'firstName lastName photoUrl age skills about');

    if (!requestsReceived || requestsReceived.length === 0) {
      return res.status(404).send('No requests received');
    }

    res.json({
      message: 'Requests received successfully',
      data: requestsReceived,
    });
  } catch (err) {
    res.status(400).send('Error: ' + err?.message);
  }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          status: 'accepted',
        },
        {
          toUserId: loggedInUser._id,
          status: 'accepted',
        },
      ],
    })
      .populate('fromUserId', 'firstName lastName photoUrl age skills about')
      .populate('toUserId', 'firstName lastName photoUrl age skills about');

    if (!connections || connections.length === 0) {
      return res.status(404).send('No connections found');
    }

    const data = connections.map((connections) => {
      if (
        connections.fromUserId._id.toString() === loggedInUser._id.toString()
      ) {
        return {
          user: connections.toUserId,
          status: connections.status,
        };
      }
      return {
        user: connections.fromUserId,
        status: connections.status,
      };
    });

    res.json({
      data: data,
      message: 'Connections fetched successfully',
    });
  } catch (err) {
    res.status(400).send('Error: ' + err?.message);
  }
});

//pageNumber, skip and limit concept for pagination
// page 1 limit 10 (0 - 10)
// page 2 limit 10 (11 - 20)
// page 3 limit 10 (21 - 30)
// formula: (page - 1) * limit;
// /user/feed?page=1&limit=10
userRouter.get('/user/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let page = req.query.page;
    page = page < 1 ? 1 : page;
    let limit = req?.query?.limit || 10;
    limt = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const myConnections = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    })
      .select('fromUserId toUserId')
      .populate('fromUserId', 'firstName')
      .populate('toUserId', 'firstName');

    const restrictedUsers = new Set();

    myConnections.forEach((connections) => {
      restrictedUsers.add(connections.fromUserId._id.toString());
      restrictedUsers.add(connections.toUserId._id.toString());
    });

    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(restrictedUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select('firstName lastName photoUrl age skills about')
      .skip(skip)
      .limit(limit);

    res.send(feedUsers);
    //const feedUsers = res.send(connections);
  } catch (err) {
    res.status(400).send('Error: ' + err?.message);
  }
});

module.exports = userRouter;
