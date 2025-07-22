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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const ServiceMessage_1 = require("../../utils/ServiceMessage");
const otp_1 = require("../../utils/otp");
const hash_1 = require("../../utils/hash");
const jwt_1 = require("../../utils/jwt");
const mail_service_1 = require("../mail.service");
const httpStatus_1 = require("../../utils/httpStatus");
class AuthService {
    constructor(PatientRepo, doctorRepo, adminRepo) {
        this.PatientRepo = PatientRepo;
        this.doctorRepo = doctorRepo;
        this.adminRepo = adminRepo;
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = null;
            user = (yield this.PatientRepo.findByEmail(email));
            let role = "patients";
            if (!user) {
                user = (yield this.doctorRepo.findByEmail(email));
                role = "doctors";
            }
            if (!user) {
                // console.log('1')
                user = (yield this.adminRepo.findByEmail(email));
                role = "admin";
            }
            if (!user) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.USER_NOT_FOUND);
            }
            if (role === "admin") {
                if (password !== user.password) {
                    throw new Error(ServiceMessage_1.SERVICE_MESSAGE.PASSWORD_NOT_MATCH);
                }
            }
            else {
                const isPassword = yield (0, hash_1.comparePassword)(password, user.password);
                if (!isPassword) {
                    throw new Error(ServiceMessage_1.SERVICE_MESSAGE.PASSWORD_NOT_MATCH);
                }
            }
            const payload = {
                id: user._id.toString(),
                email: user.email,
                role: role,
            };
            const accessToken = (0, jwt_1.generateAccessToken)(payload);
            const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
            return {
                msg: ServiceMessage_1.SERVICE_MESSAGE.USER_LOGIN_SUCCESS,
                user,
                accessToken,
                refreshToken,
            };
        });
    }
    signup(name, email, password, phone, dob, gender, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = (0, otp_1.generateOTP)();
            console.log("otp is", otp);
            const otpExpire = new Date(Date.now() + 60 * 1000);
            const hashedPassword = yield (0, hash_1.hashPassword)(password);
            if (role === "patients") {
                const existingUser = yield this.PatientRepo.findByEmail(email);
                if (existingUser) {
                    throw new Error(ServiceMessage_1.SERVICE_MESSAGE.USER_ALREADY_EXISTS);
                }
                const newPatient = {
                    name,
                    email,
                    DOB: dob,
                    phone,
                    gender: gender,
                    password: hashedPassword,
                    otp,
                    otpExpire,
                    isVerified: false,
                    role: "patients",
                };
                yield this.PatientRepo.create(newPatient);
            }
            else if (role === "doctors") {
                const existingDoctor = yield this.doctorRepo.findByEmail(email);
                if (existingDoctor) {
                    throw new Error(ServiceMessage_1.SERVICE_MESSAGE.USER_ALREADY_EXISTS);
                }
                const newDoctor = {
                    name,
                    email,
                    DOB: dob,
                    phone,
                    gender: gender,
                    password: hashedPassword,
                    otp,
                    otpExpire,
                    isVerified: false,
                    role: "doctors",
                };
                yield this.doctorRepo.create(newDoctor);
            }
            const mailService = new mail_service_1.MailService();
            yield mailService.sendMail(email, `Your OTP code`, `Hi ${name},\n\nYour OTP is : ${otp}\nIt will expire in 1 minit.`);
            return;
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = null;
            user = yield this.PatientRepo.findByEmail(email);
            let role = "patients";
            if (!user) {
                user = yield this.doctorRepo.findByEmail(email);
                role = "doctors";
            }
            if (!user) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.USER_NOT_FOUND);
            }
            if (role === "patients") {
                yield this.PatientRepo.verifyOtp(email, otp);
            }
            else {
                yield this.doctorRepo.verifyOtp(email, otp);
            }
            return { msg: ServiceMessage_1.SERVICE_MESSAGE.OTP_VERIFIED_SUCCESS, role, user: user._id };
        });
    }
    findOrCreateGoogleUser(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.PatientRepo.findByGoogleId(profile.id);
            if (existingUser)
                return existingUser;
            const newUser = yield this.PatientRepo.createWithGoogle(profile);
            return newUser;
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.PatientRepo.findById(id);
        });
    }
    logOut() {
        return __awaiter(this, void 0, void 0, function* () {
            return "Logout success";
        });
    }
    resendOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = null;
            user = yield this.PatientRepo.findByEmail(email);
            let role = "patients";
            if (!user) {
                user = yield this.doctorRepo.findByEmail(email);
                role = "doctors";
            }
            if (!user) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.USER_NOT_FOUND);
            }
            const newOTp = (0, otp_1.generateOTP)();
            console.log("resend otp", newOTp);
            const otpExpire = new Date(Date.now() + 60 * 1000);
            if (role === "patients") {
                yield this.PatientRepo.upsertWithOTP(email, newOTp, otpExpire);
            }
            else if (role === "doctors") {
                yield this.doctorRepo.upsertWithOTP(email, newOTp, otpExpire);
            }
            const mailService = new mail_service_1.MailService();
            yield mailService.sendMail(email, "Resend OTP code", `Hi ${user.name},\n\nYour New OTP code is ${newOTp}\n It will expire in 1 minit.`);
            return { msg: ServiceMessage_1.SERVICE_MESSAGE.RESEND_OTP_SUCCESS };
        });
    }
    verifiyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = null;
            user = yield this.PatientRepo.findByEmail(email);
            let role = "patients";
            if (!user) {
                user = yield this.doctorRepo.findByEmail(email);
                role = "doctors";
            }
            if (!user) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.USER_NOT_FOUND);
            }
            const otp = (0, otp_1.generateOTP)();
            const otpExpire = new Date(Date.now() + 60 * 1000);
            if (role === "patients") {
                yield this.PatientRepo.upsertWithOTP(email, otp, otpExpire);
            }
            else {
                yield this.doctorRepo.upsertWithOTP(email, otp, otpExpire);
            }
            const mailService = new mail_service_1.MailService();
            yield mailService.sendMail(email, "Password Change OTP code", `Hi ${user.name},\n\nYour OTP code is ${otp}\n It will expire in 1 minit.`);
            return { msg: ServiceMessage_1.SERVICE_MESSAGE.OTP_SEND_SUCCESS };
        });
    }
    verifyEmailOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = null;
            user = yield this.PatientRepo.findByEmail(email);
            let role = "patients";
            if (!user) {
                user = yield this.doctorRepo.findByEmail(email);
                role = "doctors";
            }
            if (!user) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.USER_NOT_FOUND);
            }
            if (role === "patients") {
                yield this.PatientRepo.verifyOtp(email, otp);
            }
            else {
                yield this.doctorRepo.verifyOtp(email, otp);
            }
            return { msg: ServiceMessage_1.SERVICE_MESSAGE.OTP_VERIFIED_SUCCESS };
        });
    }
    forgotPassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.PatientRepo.findByEmail(email);
            console.log("user is ", user);
            if (!user) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.USER_NOT_FOUND);
            }
            const hashedPassword = yield (0, hash_1.hashPassword)(newPassword);
            const updated = yield this.PatientRepo.updatePasswordWithEmail(email, hashedPassword);
            console.log("updated user is", updated);
            return { msg: ServiceMessage_1.SERVICE_MESSAGE.PASSWORD_UPDATE_SUCCESS };
        });
    }
    refreshAccessToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
            if (!refreshToken) {
                throw new Error("No refresh token provieded");
                return;
            }
            const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
            console.log('decode', decoded);
            if (!decoded) {
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                return res.status(403).json({ msg: "Invalid or expired refresh token" });
            }
            let user;
            if (decoded.role === "patient") {
                user = yield this.PatientRepo.findById(decoded.id);
            }
            else if (decoded.role === "doctor") {
                user = yield this.doctorRepo.findById(decoded.id);
            }
            else if (decoded.role === "admin") {
                user = yield this.adminRepo.findById(decoded.id);
            }
            const payload = {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
            };
            const newAccessToken = (0, jwt_1.generateAccessToken)(payload);
            const newRefreshToken = (0, jwt_1.generateRefreshToken)(payload);
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
            });
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(httpStatus_1.HttpStatus.OK).json({ msg: "token refreshed" });
        });
    }
}
exports.AuthService = AuthService;
