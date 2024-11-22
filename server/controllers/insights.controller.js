import mongoose from "mongoose";
import { User } from '../models/user.model.js';
import axios from 'axios';
import vader from 'vader-sentiment';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

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
        // console.log({insightsUrl, insightsParams});
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

        return res
        .status(200)
        .json({ sentimentCounts, comments });

    } catch (error) {
        next(error);
    }
};

export {
    fetchInsights,
    analyzeComments
}