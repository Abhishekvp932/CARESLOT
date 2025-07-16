"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confiqurePassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_service_1 = require("../services/auth/auth.service");
const auth_repository_1 = require("../repositories/auth/auth.repository");
const doctor_auth_repository_1 = require("../repositories/doctors/doctor.auth.repository");
const admin_repository_1 = require("../repositories/admin/admin.repository");
dotenv_1.default.config();
const confiqurePassport = () => {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/auth/google/callback",
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authService = new auth_service_1.AuthService(new auth_repository_1.PatientRepository(), new doctor_auth_repository_1.DoctorAuthRepository(), new admin_repository_1.AdminRepository());
            const user = yield authService.findOrCreateGoogleUser(profile);
            return done(null, user);
        }
        catch (error) {
            return done(error, false);
        }
    })));
    passport_1.default.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authService = new auth_service_1.AuthService(new auth_repository_1.PatientRepository(), new doctor_auth_repository_1.DoctorAuthRepository(), new admin_repository_1.AdminRepository());
            const user = yield authService.findUserById(id);
            done(null, user);
        }
        catch (error) {
            done(error, null);
        }
    }));
};
exports.confiqurePassport = confiqurePassport;
