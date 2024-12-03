import React, { useEffect, useState } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { useUserContext } from '../contexts/userContext';

import { Chart, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

// Register the necessary elements
Chart.register(
  ArcElement, 
  BarElement, 
  LineElement, 
  PointElement, // Register PointElement for Line chart
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend
);


function InsightsPage() {
  const { mediaId } = useParams();
  const { user } = useUserContext();
  const [sentimentData, setSentimentData] = useState(null);
  const [insightsData, setInsightsData] = useState(null);
  const [sentimentOverTimeData, setSentimentOverTimeData] = useState(null);
  const [keywordsData, setKeywordsData] = useState(null);

  useEffect(() => {
    if (user?._id) {
      handleAnalyzeSentiment();
      handleFetchInsights();
    }
  }, [user]);

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  // Fetch sentiment analysis
  const handleAnalyzeSentiment = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/insights/analyze-comments/${mediaId}`, options);
      const data = await response.json();
      setSentimentData(data.sentimentCounts);
      setSentimentOverTimeData(data.sentimentOverTime);
      setKeywordsData(data.keywordsData);
    } catch (error) {
      console.error('Error analyzing comments', error);
    }
  };

  // Fetch insights
  const handleFetchInsights = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/insights/fetch-insights/${mediaId}`, options);
      const data = await response.json();
      setInsightsData(data.insightsData);
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
      borderWidth: 1,
    }],
  } : null;

  // Data for bar chart (Sentiment distribution)
  const barChartData = sentimentData ? {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      label: '# of Comments',
      data: [sentimentData.Positive, sentimentData.Neutral, sentimentData.Negative],
      backgroundColor: ['#66b3ff', '#99ff99', '#ff9999'],
      borderColor: ['#000000', '#000000', '#000000'],
      borderWidth: 1,
    }],
  } : null;

  // Data for bar chart (Insights data)
  const barChartData2 = insightsData ? {
    labels: Object.keys(insightsData),
    datasets: [{
      label: 'Values',
      data: Object.values(insightsData),
      backgroundColor: ['#66b3ff', '#99ff99', '#ff9999', '#ffcc99', '#c2c2f0', '#ff6666', '#9999ff'],
      borderColor: '#000000',
      borderWidth: 1,
    }],
  } : null;

  // Data for line chart (Sentiment over time)
  const sentimentOverTimeChartData = sentimentOverTimeData ? {
    labels: Object.keys(sentimentOverTimeData),
    datasets: [
      {
        label: 'Positive Sentiment',
        data: Object.values(sentimentOverTimeData).map(date => date.positive),
        borderColor: '#66b3ff',
        fill: false,
      },
      {
        label: 'Neutral Sentiment',
        data: Object.values(sentimentOverTimeData).map(date => date.neutral),
        borderColor: '#99ff99',
        fill: false,
      },
      {
        label: 'Negative Sentiment',
        data: Object.values(sentimentOverTimeData).map(date => date.negative),
        borderColor: '#ff9999',
        fill: false,
      },
    ],
  } : null;

  return (
    <div className="flex flex-col gap-20 items-center">
      <h1 className='text-4xl mt-20 pt-10 flex justify-center'>Social Media Analytics</h1>

      {sentimentData && (
        <div className='flex flex-col items-center gap-10'>
          <div>Sentiment Data</div>
          <div className='flex gap-20'>
            <div>
              <div style={{ width: '400px', height: '400px' }}>
                <Pie data={pieChartData} />
              </div>
            </div>

            <div>
              <div style={{ width: '600px', height: '400px' }}>
                <Bar data={barChartData} />
              </div>
            </div>
          </div>
        </div>
      )}

      {insightsData && (
        <div className='flex flex-col items-center gap-10'>
          <div>Insights Data</div>
          <div className='flex justify-center'>
            <div style={{ width: '600px', height: '400px' }}>
              <Bar data={barChartData2} />
            </div>
          </div>
        </div>
      )}

      {sentimentOverTimeData && (
        <div className='flex flex-col items-center gap-10'>
          <div>Sentiment Over Time</div>
          <div style={{ width: '800px', height: '400px' }}>
            <Line data={sentimentOverTimeChartData} />
          </div>
        </div>
      )}

      {keywordsData && (
        <div className='flex flex-col items-center gap-10'>
          <div>Keywords Extracted from Comments</div>
          <div>
            <ul>
              {keywordsData.map((item, index) => (
                <li key={index}>
                  <strong>{item.username}:</strong> {item.keywords.join(', ')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default InsightsPage;
