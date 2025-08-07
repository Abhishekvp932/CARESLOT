import passport, { use } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { AuthService } from "../services/auth/auth.service";
import { access } from "fs";
import { profile } from "console";
import { PatientRepository } from "../repositories/auth/auth.repository";
import { DoctorAuthRepository } from "../repositories/doctors/doctor.auth.repository";
import { AdminRepository } from "../repositories/admin/admin.repository";
dotenv.config();

export const confiqurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "http://localhost:3000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const authService = new AuthService(new PatientRepository(),new DoctorAuthRepository(),new AdminRepository());
          const user = await authService.findOrCreateGoogleUser(profile);
          return done(null, user);
        } catch (error) {
          return done(error as any, false);
        }
      }
    )
  );
  passport.serializeUser((user: any, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id: string, done) => {
    try {
      const authService = new AuthService(new PatientRepository(),new DoctorAuthRepository(),new AdminRepository());
      const user = await authService.findUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
