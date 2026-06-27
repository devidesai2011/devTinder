#devTinder API's

Auth Router
- POST /SignUp
- POST /login
- POST /logout

Profile Router
- PATCH /profile/edit
- PATCH /profile/password
- GET /profile/view

Connection request router
- POST /request/send/interested/:profileId
- POST /request/send/ignored/:profileId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

User router
- GET /user/connections
- GET /user/requests/received
- GET /user/feed - Gets you the profile of other users on the platform.

  status: ignored, interested, accepted, rejected
