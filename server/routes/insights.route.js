import mongoose from "mongoose";
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { analyzeComments, fetchInsights } from "../controllers/insights.controller.js";

const router = Router();

router.route("/fetch-insights/:mediaId").get(verifyJWT, fetchInsights);
router.route("/analyze-comments/:mediaId").get(verifyJWT, analyzeComments);

export default router;