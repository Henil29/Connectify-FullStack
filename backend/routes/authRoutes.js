import express from 'express';
import { loginUser, logoutUser, registerUser, sendOtp, verifyOtp } from '../controllers/authControllers.js';
import uploadFile from '../middlewares/multer.js';

const router = express.Router();

router.post("/register",uploadFile,registerUser)
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;