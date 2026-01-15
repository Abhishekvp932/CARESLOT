import express from 'express';
import { AuthController } from '../controllers/auth/auth.controller';
import { AuthService } from '../services/auth/auth.service';
import { PatientRepository } from '../repositories/auth/auth.repository';
import passport from 'passport';

import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { AdminRepository } from '../repositories/admin/admin.repository';
import redisClient from '../config/redisClient';
import { v4 as uuidv4 } from 'uuid';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { Routers } from '../utils/Routers';
import { IBaseUser } from '../utils/IBaseUser';
import dotenv from 'dotenv';
import logger from '../utils/logger';
dotenv.config();
const patientRepository = new PatientRepository();
const doctorRepository = new DoctorAuthRepository();
const adminRepository = new AdminRepository();
const authService = new AuthService(
  patientRepository,
  doctorRepository,
  adminRepository
);
const authMiddleware = new AuthMiddleware(patientRepository, doctorRepository);
const authController = new AuthController(authService);
const router = express.Router();

router.post(
  Routers.authRouters.login,
  authController.login.bind(authController)
);

router.post(
  Routers.authRouters.signup,
  authController.signup.bind(authController)
);

router.post(
  Routers.authRouters.verifyOtp,
  authController.verifyOTP.bind(authController)
);

router.get(
  Routers.authRouters.google,
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  Routers.authRouters.me,
  authMiddleware.isBlockedOrNot,
  authMiddleware.protect,
  authMiddleware.protect,
  authController.getMe.bind(authController)
);

router.get(
  Routers.authRouters.googleCallback,
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    const user = req.user as IBaseUser;
    logger.info('google auth user info');
    logger.debug(user);
    if (!user) {
      return res.redirect('https://careslotsit.vercel.app/login');
    }

    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    logger.info('payload of google auth user');
    logger.debug(payload);
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const sessionId = uuidv4();
    await redisClient.set(`access:${sessionId}`, accessToken, {
      EX: Number(process.env.ACCESS_TOKEN_EXPIRE_TIME),
    });
    await redisClient.set(`refresh:${sessionId}`, refreshToken, {
      EX: Number(process.env.REFRESH_TOKEN_EXPIRE_TIME),
    });
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: Number(process.env.REDIS_SESSION_MAX_AGE),
    });


   const redirectUrl = process.env.CLIENT_URL as string;
     res.redirect(redirectUrl);
  }
);

router.post(
  Routers.authRouters.logout,
  authController.logOut.bind(authController)
);

router.post(
  Routers.authRouters.resendOtp,
  authController.resendOTP.bind(authController)
);

router.post(
  Routers.authRouters.sendOtp,
  authController.verfiyEmail.bind(authController)
);

router.post(
  Routers.authRouters.verifyEmail,
  authController.verifyEmailOTP.bind(authController)
);

router.post(
  Routers.authRouters.forgotPassword,
  authController.forgotPassword.bind(authController)
);

router.post(
  Routers.authRouters.refreshToken,
  authController.refreshToken.bind(authController)
);

export default router;
