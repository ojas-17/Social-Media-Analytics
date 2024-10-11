import './App.css'
import React, { useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function App() {
  const [mediaId, setMediaId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [userId, setUserId] = useState('17841469388966468');
  const [sentimentData, setSentimentData] = useState(null);
  const [insightsData, setInsightsData] = useState(null);

  // Fetch sentiment analysis
  const handleAnalyzeSentiment = async () => {
    try {
      const response = await axios.post('http://localhost:5000/analyze-comments', {
        mediaId,
        accessToken
      });
      setInsightsData(null);
      setSentimentData(response.data.sentimentCounts);
    } catch (error) {
      console.error('Error analyzing comments', error);
    }
  };

  // Fetch insights
  const handleFetchInsights = async () => {
    try {
      const response = await axios.post('http://localhost:5000/fetch-insights', {
        mediaId,
        userId,
        accessToken
      });
      setSentimentData(null);
      setInsightsData(response.data.insightsData);
    } catch (error) {
      console.error('Error fetching insights', error);
    }
  };

  // Data for pie chart
  const pieChartData = sentimentData ? {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      data: [sentimentData.Positive, sentimentData.Neutral, sentimentData.Negative],
      backgroundColor: ['#66b3ff', '#99ff99', '#ff9999'],
      borderColor: ['#000000', '#000000', '#000000'],
      borderWidth: 1
    }]
  } : null;

  // Data for bar chart
  const barChartData = sentimentData ? {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      label: '# of Comments',
      data: [sentimentData.Positive, sentimentData.Neutral, sentimentData.Negative],
      backgroundColor: ['#66b3ff', '#99ff99', '#ff9999'],
      borderColor: ['#000000', '#000000', '#000000'],
      borderWidth: 1
    }]
  } : null;

  const barChartData2 = insightsData ? {
    labels: Object.keys(insightsData),
    datasets: [{
      label: 'Values',
      data: Object.values(insightsData),
      backgroundColor: ['#66b3ff', '#99ff99', '#ff9999', '#ffcc99', '#c2c2f0', '#ff6666', '#9999ff'],
      borderColor: '#000000',
      borderWidth: 1
    }]
  } : null;

  return (
    <div className="flex flex-col gap-10">
      <h1>Social Media Analytics</h1>

      {/* Sentiment Analysis Section */}
      {/* <h2>Sentiment Analysis</h2> */}

      <div className='flex justify-center gap-3'>
        <input
          type="text"
          placeholder="Media ID"
          className='rounded-lg'
          value={mediaId}
          onChange={(e) => setMediaId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Access Token"
          className='rounded-lg'
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
        />
        <button onClick={handleAnalyzeSentiment}>Analyze Sentiment</button>

        <button onClick={handleFetchInsights}>Fetch Insights</button>
      </div>

      {sentimentData && (
        <div className='flex gap-20'>
          <div>
            {/* <h3>Sentiment Distribution</h3> */}
            <div style={{ width: '400px', height: '400px' }}>
              <Pie data={pieChartData} />
            </div>
          </div>

          <div>
            {/* <h3>Post Insights Data</h3> */}
            <div style={{ width: '600px', height: '400px' }}>
              <Bar data={barChartData} />
            </div>
          </div>
        </div>
      )}

      {insightsData && (
        <div>
          {/* <h3>Post Insights Data</h3> */}
          <div style={{ width: '600px', height: '400px' }}>
            <Bar data={barChartData2} />
          </div>
        </div>
      )}

      {/* Insights Section */}
      {/* <h2>Post Insights</h2> */}
      {/* <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      /> */}

    </div>
  );
}

export default App;

