const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Add body parsing middleware
app.use(bodyParser.json());

// Import the user router
const videos = require('./src/routes/v0/videos');
const activities = require('./src/routes/v0/activities');
const channels = require('./src/routes/v0/channels');
const playlists = require('./src/routes/v0/playlists');
const search = require('./src/routes/v0/search');
const commentThreads = require('./src/routes/v0/commentThreads');
const subscriptions = require('./src/routes/v0/subscriptions');

// Use the user router for routes starting with '/v0/videos'
app.use('/v0', videos);
// Use the user router for routes starting with '/v0/activities'
//app.use('/v0', activities);
 //Use the user router for routes starting with '/v0/channels'
app.use('/v0', channels);
// Use the user router for routes starting with '/v0/playlists'
//app.use('/v0', playlists);
// Use the user router for routes starting with '/v0/search'
//app.use('/v0', search);
// Use the user router for routes starting with '/v0/commentThreads'
//app.use('/v0', commentThreads);
// Use the user router for routes starting with '/v0/subscriptions'
//app.use('/v0', subscriptions);

// Define a health check route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
