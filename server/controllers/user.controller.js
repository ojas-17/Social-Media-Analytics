import mongoose from "mongoose";
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        // console.log({accessToken, refreshToken});
        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }
};

const getFacebookPageId = async (access_token) => {
    try {
        const accountsUrl = `https://graph.facebook.com/v20.0/me?fields=accounts&access_token=${access_token}`;
        const res = await fetch(accountsUrl)
        if(!res.ok) {
            throw new ApiError(500, "Error fetching facebookPageId");
        }
        const data = await res.json();
        const facebookPageId = data?.accounts?.data?.[0]?.id;
        if(!facebookPageId) {
            throw new ApiError(400, "Invalid access token");
        }
    
        return facebookPageId;

    } catch (error) {
        throw error;
    }
};

const getInstagramAccountId = async (facebookPageId, access_token) => {
    try {
        const url = `https://graph.facebook.com/v20.0/${facebookPageId}?fields=instagram_business_account&access_token=${access_token}`;
        const res = await fetch(url);
        if(!res.ok) {
            throw new ApiError(500, "Error fetching Instagram Account Id");
        }

        const data = await res.json();
        const instagramAccountId = data?.instagram_business_account?.id;
        if(!instagramAccountId) {
            throw new ApiError(400, "Invalid facebook page id");
        }

        return instagramAccountId;    

    } catch (error) {
        throw error;
    }
};

const registerUser = async (req, res, next) => {
    try {
        const {email, fullName, password} = req.body;
        // console.log(req.body);
        if([email, fullName, password].some((field) => !field?.trim())) {
            throw new ApiError(400, "All fields are required");
        }

        const existedUser = await User.findOne({email});
        if(existedUser) {
            throw new ApiError(409, "User with email already exists");
        }

        const user = await User.create({
            email: email.toLowerCase(),
            fullName,
            password
        });

        const createdUser = await User.findOne(user._id).select("-password -refreshToken");
        if(!createdUser) {
            throw new ApiError(500, "Something went wrong while creating the user");
        }

        return res
        .status(200)
        .json(new ApiResponse(200, createdUser, "User Created Successfully"));

    } catch (error) {
        // console.log(error);
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            throw new ApiError(400, "All fields are required");
        }

        // console.log(email);
        const user = await User.findOne({email});
        
        if(!user) {
            throw new ApiError(404, "User does not exist");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if(!isPasswordValid) {
            throw new ApiError(401, "Incorrect Password");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));

    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(
            req.user?._id,
            {
                $unset: {
                    refreshToken: 1
                }
            },
            {
                new: true
            }
        );

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));

    } catch (error) {
        next(error);
    }
};

const updatePassword = async (req, res, next) => {
    try {
        const {oldPassword, newPassword} = req.body;
        if(!oldPassword || !newPassword) {
            throw new ApiError(400, "All fields are required");
        }

        const user = await User.findById(req.user?._id);
        const isPasswordValid = await user.isPasswordCorrect(oldPassword);
        if(!isPasswordValid) {
            throw new ApiError(400, "Invalid Old Password");
        }

        user.password = newPassword;
        await user.save({validateBeforeSave: false});

        const updatedUser = await User.findById(user._id).select("-password -refreshToken");
        
        return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "User Password Updated Successfully"));

    } catch (error) {
        next(error);
    }
};

const updateDetails = async (req, res, next) => {
    try {
        const { fullName, apiToken } = req.body;

        if(!(fullName || apiToken)) {
            throw new ApiError(400, "Atleast one field is required");
        }
    
        const user = await User.findById(req.user._id);
        if(!user) {
            throw new ApiError(404, "User not found");
        }
    
        if(fullName) {
            user.fullName = fullName;
        }
        if(apiToken) {
            const facebookPageId = await getFacebookPageId(apiToken.trim());
            const instagramAccountId = await getInstagramAccountId(facebookPageId, apiToken)
            user.instagramAccountId = instagramAccountId;
            user.apiToken = apiToken.trim();
        }

        await user.save({validateBeforeSave: false});

        const updatedUser = await User.findById(user._id).select("-password -refreshToken");
        if(!updatedUser) {
            throw new ApiError(500, "Something went wrong while updating the user");
        }
    
        return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "User updated successfully"));

    } catch (error) {
        next(error);
    }

};

const refreshAccessToken = async (req, res, next) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
        // console.log(req.cookies);
        if(!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized Request");
        }

        const decodedToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id);
    
        if(!user) {
            throw new ApiError(401, "Invalid refresh token");
        }
        // console.log(user);
    
        if(incomingRefreshToken !== user?.refreshToken) {
            // console.log(incomingRefreshToken);
            // console.log(user?.refreshToken);
            throw new ApiError(401, "Refresh Token is expired");
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);
        // console.log({accessToken, refreshToken});

        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken},
                "Access Token refreshed successfully"
            )
        );
    } catch (error) {
        next(new ApiError(401, error?.message || "Invalid refresh token"));
    }

};

const getCurrentUser = async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User fetched successfully"));
};

export {
    registerUser,
    login,
    logout,
    updatePassword,
    updateDetails,
    refreshAccessToken,
    getCurrentUser
}