import { Router } from 'express';
import {
    getCurrentUser,
    login,
    logout,
    refreshAccessToken,
    registerUser,
    updateDetails,
    updatePassword
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/update-details").patch(verifyJWT, updateDetails);
router.route("/update-password").patch(verifyJWT, updatePassword);
router.route("/refresh-token").get(refreshAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);

export default router;