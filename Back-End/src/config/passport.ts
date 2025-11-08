import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { AuthService } from '../services/auth/auth.service';

import { PatientRepository } from '../repositories/auth/auth.repository';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { AdminRepository } from '../repositories/admin/admin.repository';
import { IBaseUser } from '../utils/IBaseUser';
dotenv.config();

export const confiqurePassport = () => {
  const GOOGLE_CALLBACK_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.GOOGLE_CALLBACK_URL_PROD
    : process.env.GOOGLE_CALLBACK_URL_DEV;

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL:GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const authService = new AuthService(
            new PatientRepository(),
            new DoctorAuthRepository(),
            new AdminRepository()
          );
          const user = await authService.findOrCreateGoogleUser(profile);
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user: unknown, done) => {
    const typedUser = user as IBaseUser;
    done(null, typedUser._id);
  });
  passport.deserializeUser(async (id: string, done) => {
    try {
      const authService = new AuthService(
        new PatientRepository(),
        new DoctorAuthRepository(),
        new AdminRepository()
      );
      const user = await authService.findUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
