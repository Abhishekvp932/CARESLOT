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
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth/auth.controller");
const auth_service_1 = require("../services/auth/auth.service");
const auth_repository_1 = require("../repositories/auth/auth.repository");
const passport_1 = __importDefault(require("passport"));
const jwt_1 = require("../utils/jwt");
const doctor_auth_repository_1 = require("../repositories/doctors/doctor.auth.repository");
const admin_repository_1 = require("../repositories/admin/admin.repository");
const PatientRepo = new auth_repository_1.PatientRepository();
const doctorRepo = new doctor_auth_repository_1.DoctorAuthRepository();
const adminRepo = new admin_repository_1.AdminRepository();
const authService = new auth_service_1.AuthService(PatientRepo, doctorRepo, adminRepo);
const authController = new auth_controller_1.AuthController(authService);
const router = express_1.default.Router();
// Patient routes
router.post('/login', authController.login.bind(authController));
router.post('/signup', authController.signup.bind(authController));
router.post('/verify-otp', authController.verifyOTP.bind(authController));
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/me', authController.getMe.bind(authController));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return res.redirect('http://localhost:2025/login');
    }
    const token = (0, jwt_1.genarateToken)({
        id: user._id,
        email: user.email,
        role: user.role
    });
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    });
    return res.redirect('http://localhost:2025/');
}));
router.get('/logout', authController.logOut.bind(authController));
router.post('/resend-otp', authController.resendOTP.bind(authController));
router.post('/send-otp', authController.verfiyEmail.bind(authController));
router.post('/verify-email', authController.verifyEmailOTP.bind(authController));
router.post('/forgot-password', authController.forgotPassword.bind(authController));
exports.default = router;
