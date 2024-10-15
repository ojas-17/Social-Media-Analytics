const express = require('express');
const axios = require('axios');
const session = require('cookie-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(session({
  name: 'session',
  keys: [process.env.SESSION_SECRET],
}));

// Step 1: Redirect to Instagram for authentication
app.get('/auth/instagram', (req, res) => {
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.redirect(authUrl);
});

// Step 2: Handle the callback from Instagram
app.get('/auth/instagram/callback', async (req, res) => {
  const { code } = req.query;

  // Exchange code for access token
  try {
    const response = await axios.post('https://api.instagram.com/oauth/access_token', {
      client_id: process.env.INSTAGRAM_APP_ID,
      client_secret: process.env.INSTAGRAM_APP_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.REDIRECT_URI,
      code: code,
    });

    // Save the access token in session
    req.session.access_token = response.data.access_token;
    res.redirect('/media');
  } catch (error) {
    console.error('Error getting access token:', error);
    res.status(500).send('Authentication failed');
  }
});

// Step 3: Fetch user media
app.get('/media', async (req, res) => {
  if (!req.session.access_token) {
    return res.redirect('/auth/instagram');
  }

  try {
    const mediaResponse = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url&access_token=${req.session.access_token}`);
    res.json(mediaResponse.data);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).send('Failed to fetch media');
  }
});

// Step 4: Fetch comments for a specific media
app.get('/media/:mediaId/comments', async (req, res) => {
  const mediaId = req.params.mediaId;

  if (!req.session.access_token) {
    return res.redirect('/auth/instagram');
  }

  try {
    const commentsResponse = await axios.get(`https://graph.instagram.com/${mediaId}/comments?access_token=${req.session.access_token}`);
    res.json(commentsResponse.data);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Failed to fetch comments');
  }
});

app.get('/', (req, res) => {
    res.send('Server is running');
})

//----

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
