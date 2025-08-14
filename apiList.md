# DevTinder APIs

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectuionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignored/:/userId

## Above two can be made dynamic using bottom one

- POST /request/send/:status/:/userId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## Above two can be made dynamic using bottom one

- POST /request/review/:status/:requestId

## userRouter

- GET /user/connections
- GET /user/requests/received
- GET /feed - Gets you the profiles of other users on platform

  status: ignore, interested, accepted, rejected
