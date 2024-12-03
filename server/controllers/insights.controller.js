import mongoose from "mongoose";
import { User } from '../models/user.model.js';
import axios from 'axios';
import vader from 'vader-sentiment';
import natural from 'natural';
import moment from 'moment';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

import Sentiment from 'sentiment';
const sentiment = new Sentiment();

// Sentiment analysis
const analyzeSentiment = (text) => {
    const result = sentiment.analyze(text);
    return result.score > 0 ? 'positive' : result.score < 0 ? 'negative' : 'neutral';
};

// Extract keywords
const extractKeywords = (text) => {
    const tokenizer = new natural.WordTokenizer();
    return tokenizer.tokenize(text).filter(word => word.length > 3); // Filter out short words
};

// Sentiment over time analysis
const analyzeSentimentOverTime = (comments) => {
    const groupedByDate = {};

    comments.forEach(comment => {
        const date = moment(comment.timestamp).format('YYYY-MM-DD'); // Group by day
        const sentiment = analyzeSentiment(comment.text);

        if (!groupedByDate[date]) {
            groupedByDate[date] = { positive: 0, neutral: 0, negative: 0 };
        }

        groupedByDate[date][sentiment]++;
    });

    return groupedByDate;
};

const fetchInsights = async (req, res, next) => {
    try {
        const { mediaId } = req.params;

        const user = await User.findById(req.user?._id);
        const accessToken = user?.apiToken;
        const userId = user?.instagramAccountId;

        // Fetch post insights
        const insightsUrl = `https://graph.facebook.com/v20.0/${mediaId}/insights`;
        const insightsParams = {
            metric: "likes,comments,shares,saved,total_interactions,profile_visits",
            access_token: accessToken,
        };

        const insightsResponse = await axios.get(insightsUrl, {
            params: insightsParams,
        });
        const insights = insightsResponse.data.data;

        // Format insights data
        let insightsData = {};
        insights.forEach((insight) => {
            insightsData[insight.title] = insight.values[0].value;
        });

        // Fetch user followers count
        const followersUrl = `https://graph.facebook.com/v20.0/${userId}`;
        const followersParams = {
            fields: "followers_count",
            access_token: accessToken,
        };

        const followersResponse = await axios.get(followersUrl, {
            params: followersParams,
        });
        const followersCount = followersResponse.data.followers_count;

        // Add followers count to insights
        insightsData["Followers Count"] = followersCount;

        return res
            .status(200)
            .json({ insightsData });
    } catch (error) {
        next(error);
    }
};

// Analyze comments and provide sentiment counts
const analyzeComments = async (req, res, next) => {
    try {
        const { mediaId } = req.params;
        
        const user = await User.findById(req.user?._id);
        const accessToken = user?.apiToken;

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

        // Analyze sentiment over time
        const sentimentOverTime = analyzeSentimentOverTime(comments);

        // Extract keywords for each comment
        const keywordsData = comments.map(comment => ({
            username: comment.username,
            text: comment.text,
            keywords: extractKeywords(comment.text)
        }));

        return res
            .status(200)
            .json({ sentimentCounts, sentimentOverTime, keywordsData, comments });

    } catch (error) {
        next(error);
    }
};

export {
    fetchInsights,
    analyzeComments
};
