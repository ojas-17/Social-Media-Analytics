import React, { useEffect, useState } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { useUserContext } from '../contexts/userContext';
import { Chart, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import WordCloud from 'react-wordcloud';

// Register the necessary chart elements
Chart.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
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
  const [commentersData, setCommentersData] = useState(null);
  const [commentLengths, setCommentLengths] = useState(null);
  const [avgCommentLength, setAvgCommentLength] = useState(0);
  const [avgSentiment, setAvgSentiment] = useState(null);

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

      // Calculate Comment Lengths
      const lengths = data.keywordsData.map(item => item.text.length);
      setCommentLengths(lengths);
      setAvgCommentLength(lengths.reduce((acc, length) => acc + length, 0) / lengths.length);

      // Calculate average sentiment score (could be weighted based on the number of comments)
      const avgPos = (data.sentimentCounts.Positive || 0) * 1;
      const avgNeu = (data.sentimentCounts.Neutral || 0) * 0;
      const avgNeg = (data.sentimentCounts.Negative || 0) * -1;
      setAvgSentiment((avgPos + avgNeu + avgNeg) / (data.sentimentCounts.Positive + data.sentimentCounts.Neutral + data.sentimentCounts.Negative));

      // Get Top Commenters and sort them
      const commenters = data.keywordsData.reduce((acc, item) => {
        acc[item.username] = (acc[item.username] || 0) + 1;
        return acc;
      }, {});

      // Sort commenters by the number of comments in descending order and get the top 5
      const sortedCommenters = Object.entries(commenters)
        .sort((a, b) => b[1] - a[1]) // Sort by comment count (descending)
        .slice(0, 5); // Limit to top 5 commenters

      // Update the commentersData state with sorted top commenters
      const topCommenters = sortedCommenters.reduce((acc, [username, count]) => {
        acc[username] = count;
        return acc;
      }, {});

      setCommentersData(topCommenters);
    } catch (error) {
      console.error('Error analyzing comments', error);
    }
  };

  // Fetch insights data
  const handleFetchInsights = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/insights/fetch-insights/${mediaId}`, options);
      const data = await response.json();
      setInsightsData(data.insightsData);
    } catch (error) {
      console.error('Error fetching insights', error);
    }
  };

  // Pie chart for sentiment distribution
  const pieChartData = sentimentData ? {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      data: [sentimentData.Positive, sentimentData.Neutral, sentimentData.Negative],
      backgroundColor: ['#66b3ff', '#99ff99', '#ff9999'],
      borderColor: ['#000000', '#000000', '#000000'],
      borderWidth: 1,
    }],
  } : null;

  // Bar chart for sentiment distribution
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

  // Bar chart for insights data
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

  // Sentiment over time line chart
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

  // Stacked bar chart for sentiment over time
  const stackedBarChartData = sentimentOverTimeData ? {
    labels: Object.keys(sentimentOverTimeData),
    datasets: [
      {
        label: 'Positive Sentiment',
        data: Object.values(sentimentOverTimeData).map(date => date.positive),
        backgroundColor: '#66b3ff',
      },
      {
        label: 'Neutral Sentiment',
        data: Object.values(sentimentOverTimeData).map(date => date.neutral),
        backgroundColor: '#99ff99',
      },
      {
        label: 'Negative Sentiment',
        data: Object.values(sentimentOverTimeData).map(date => date.negative),
        backgroundColor: '#ff9999',
      },
    ],
  } : null;

  // Bar chart for top commenters
  const topCommentersData = commentersData ? {
    labels: Object.keys(commentersData),
    datasets: [{
      label: 'Comment Count',
      data: Object.values(commentersData),
      backgroundColor: '#66b3ff',
      borderColor: '#000000',
      borderWidth: 1,
    }],
  } : null;

  // Histogram for comment length
  const commentLengthHistogramData = commentLengths ? {
    labels: commentLengths.map((_, i) => `Comment ${i + 1}`),
    datasets: [{
      label: 'Comment Length',
      data: commentLengths,
      backgroundColor: '#99ccff',
      borderColor: '#000000',
      borderWidth: 1,
    }],
  } : null;

  return (
    <div className="flex flex-col gap-20 items-center mb-20">
      <h1 className='text-4xl mt-20 pt-10 flex justify-center'>Social Media Analytics</h1>

      {sentimentData && (
        <div className='flex flex-col items-center gap-10'>
          <div>Sentiment Data</div>
          <div className='flex gap-20'>
            <div style={{ width: '400px', height: '400px' }}>
              <Pie data={pieChartData} />
            </div>
            <div style={{ width: '600px', height: '400px' }}>
              <Bar data={barChartData} />
            </div>
          </div>
          <div>
            <h3>Average Sentiment Score: {avgSentiment.toFixed(2)}</h3>
          </div>
        </div>
      )}

      {insightsData && (
        <div className='flex flex-col items-center gap-10'>
          <div>Insights Data</div>
          <div style={{ width: '600px', height: '400px' }}>
            <Bar data={barChartData2} />
          </div>
        </div>
      )}

      {sentimentOverTimeData && (
        <div className='flex flex-col items-center gap-10'>
          <div>Sentiment Over Time</div>
          <div style={{ width: '800px', height: '400px' }}>
            <Line data={sentimentOverTimeChartData} />
          </div>
          <div style={{ width: '800px', height: '400px' }}>
            <Bar data={stackedBarChartData} options={{ indexAxis: 'x', stacked: true }} />
          </div>
        </div>
      )}

      {/* {keywordsData && (
        <div className='flex flex-col items-center gap-10'>
          <div>Keywords Extracted from Comments</div>
          <div>
            <WordCloud words={keywordsData.map(item => ({ text: item.keywords.join(' '), value: 100 }))} />
          </div>
        </div>
      )} */}

      {commentersData && (
        <div className='flex flex-col items-center gap-10'>
          <div>Top Commenters</div>
          <div style={{ width: '600px', height: '400px' }}>
            <Bar data={topCommentersData} />
          </div>
        </div>
      )}

      {commentLengths && (
        <div className='flex flex-col items-center gap-10'>
          <div>Comment Length Histogram</div>
          <div style={{ width: '600px', height: '400px' }}>
            <Bar data={commentLengthHistogramData} />
          </div>
          <div>
            <h3>Average Comment Length: {avgCommentLength.toFixed(2)} characters</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default InsightsPage;
