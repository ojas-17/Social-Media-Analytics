const express = require('express');
const axios = require('axios');
const vader = require('vader-sentiment');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Fetch Instagram Post Insights and Follower Count
app.post('/fetch-insights', async (req, res) => {
  const { mediaId, userId, accessToken } = req.body;

  try {
    // Fetch post insights
    const insightsUrl = `https://graph.facebook.com/v20.0/${mediaId}/insights`;
    const insightsParams = {
      metric: 'likes,comments,shares,saved,total_interactions,profile_visits',
      access_token: accessToken
    };

    const insightsResponse = await axios.get(insightsUrl, { params: insightsParams });
    const insights = insightsResponse.data.data;

    // Format insights data
    let insightsData = {};
    insights.forEach(insight => {
      insightsData[insight.title] = insight.values[0].value;
    });

    // Fetch user followers count
    const followersUrl = `https://graph.facebook.com/v20.0/${userId}`;
    const followersParams = {
      fields: 'followers_count',
      access_token: accessToken
    };

    const followersResponse = await axios.get(followersUrl, { params: followersParams });
    const followersCount = followersResponse.data.followers_count;

    // Add followers count to insights
    insightsData['Followers Count'] = followersCount;

    res.json({ insightsData });

  } catch (error) {
    console.error('Error fetching insights or followers count:', error);
    res.status(500).json({ error: 'Failed to fetch insights or followers count' });
  }
});

// Existing endpoint for sentiment analysis
app.post('/analyze-comments', async (req, res) => {
  const { mediaId, accessToken } = req.body;

  try {
    const url = `https://graph.facebook.com/v17.0/${mediaId}/comments`;
    const params = {
      access_token: accessToken,
      fields: 'id,username,text,timestamp'
    };

    const response = await axios.get(url, { params });
    const comments = response.data.data;

    const sentimentCounts = {
      Positive: 0,
      Neutral: 0,
      Negative: 0
    };

    comments.forEach(comment => {
      const sentiment = vader.SentimentIntensityAnalyzer.polarity_scores(comment.text);
      const compoundScore = sentiment.compound;

      if (compoundScore >= 0.05) {
        sentimentCounts['Positive'] += 1;
      } else if (compoundScore <= -0.05) {
        sentimentCounts['Negative'] += 1;
      } else {
        sentimentCounts['Neutral'] += 1;
      }
    });

    res.json({ sentimentCounts, comments });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching comments or analyzing sentiment' });
  }
});

app.get('/test', (req, res) => {
  res.send('Server is running');
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
