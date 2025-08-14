const express = require('express');
const userAuth = require('../middlewares/auth');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
requestRouter.use(express.json());

//User marking interested or ignoring a request
requestRouter.post(
  '/request/send/:status/:userId',
  userAuth,
  async (req, res, next) => {
    try {
      const fromUserId = req?.user?._id;
      const toUserId = req?.params?.userId;
      const status = req?.params?.status;

      const ALLOWED_STATUSES = ['interested', 'ignored'];

      if (fromUserId.toString() === toUserId.toString()) {
        return res.status(400).send('Cannot send request to yourself');
      }

      const toUser = await User.findOne({ _id: toUserId });
      if (!toUser) {
        return res.status(400).send('User not found');
      }

      const connectionExists = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (connectionExists) {
        return res.status(400).send('Connection already exists');
      }

      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).send('Invalid status');
      }

      const data = new ConnectionRequest({ fromUserId, toUserId, status });
      data.save();
      res.json({
        message: 'Request data saved successfully',
        data,
      });
    } catch (err) {
      res.status(400).send("Couldn't send the request " + err);
    }
  }
);

//User accepting or rejecting request from interested list
requestRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    //Thought process
    //Check if the status is accepted or rejected only as the approvee can only has these statuses
    //Check if the request id exists in DB
    //check if the loggedin user is toUserID from the document that matches the request ID
    //the status of the document should be interested

    try {
      const loggedInUser = req.user;
      const status = req.params.status;
      const requestId = req.params.requestId;

      const ACCEPTED_STATUSES = ['accepted', 'rejected'];

      if (!ACCEPTED_STATUSES.includes(status)) {
        return res.status(400).send('Invalid Status');
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: 'interested',
      });

      if (!connectionRequest) {
        return res.status(400).send("User doesn't exist");
      }

      connectionRequest.status = status;
      console.log('connection request', connectionRequest);
      await connectionRequest.save();

      res.json({
        message: `Connection request ${status}`,
        data: connectionRequest,
      });
    } catch (err) {
      res.status(400).send('Error: ' + err);
    }
  }
);

module.exports = requestRouter;
