import express from "express";
import { AuthController } from "../controllers/auth/auth.controller";
import { AuthService } from "../services/auth/auth.service"
import { PatientRepository } from "../repositories/auth/auth.repository";
import passport from "passport";
import { profile } from "console";
import { generateAccessToken,generateRefreshToken } from "../utils/jwt";
import { DoctorAuthRepository } from "../repositories/doctors/doctor.auth.repository";
import { AdminRepository } from "../repositories/admin/admin.repository";
import redisClient from "../config/redisClient";
import {v4 as uuidv4} from 'uuid'
const PatientRepo = new PatientRepository()
const doctorRepo = new DoctorAuthRepository()
const adminRepo = new AdminRepository()
const authService = new AuthService(PatientRepo,doctorRepo,adminRepo);

const authController = new AuthController(authService);
const router  = express.Router();


// Patient routes
router.post('/login',authController.login.bind(authController));
router.post('/signup',authController.signup.bind(authController))
router.post('/verify-otp',authController.verifyOTP.bind(authController))
router.get('/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/me',authController.getMe.bind(authController));


router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    const user = req.user as any;

    if (!user) {
      return res.redirect('http://localhost:2025/login');
    }

    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const sessionId = uuidv4();
    await redisClient.set(`access:${sessionId}`,accessToken,{EX:15*60});
    await redisClient.set(`refresh:${sessionId}`,refreshToken,{EX:7*24*60*60});       
    res.cookie('sessionId',sessionId,{
                httpOnly:true,
                secure:false,
                sameSite:"lax",
                maxAge:7*24*60*60*1000
            })

    return res.redirect('http://localhost:2025/');
  }
);

router.get('/logout',authController.logOut.bind(authController));
router.post('/resend-otp',authController.resendOTP.bind(authController));
router.post('/send-otp',authController.verfiyEmail.bind(authController));
router.post('/verify-email',authController.verifyEmailOTP.bind(authController));
router.post('/forgot-password',authController.forgotPassword.bind(authController));
router.post('/refresh-token',authController.refreshToken.bind(authController));

export default router