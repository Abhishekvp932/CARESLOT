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
const ServiceMessage_1 = require("../utils/ServiceMessage");
const otp_1 = require("../utils/otp");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const tempUser_1 = require("../utils/tempUser");
const mail_service_1 = require("./mail.service");
class AuthService {
    constructor(PatientRepo) {
        this.PatientRepo = PatientRepo;
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = null;
            let role = null;
            user = yield this.PatientRepo.findByEmail(email);
            if (!user) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.LOGIN_MESSAGE);
            }
            const isPassword = yield (0, hash_1.comparePassword)(password, user.password);
            if (!isPassword) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.PASSWORD_NOT_MATCH);
            }
            const token = (0, jwt_1.genarateToken)({
                id: user._id,
                email: user.email,
                role: 'patients'
            });
            return {
                msg: ServiceMessage_1.SERVICE_MESSAGE.USER_LOGIN_SUCCESS,
                user,
                role,
                token
            };
        });
    }
    signup(name, email, password, phone, dob, gender) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.PatientRepo.findByEmail(email);
            if (existingUser) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.USER_ALREADY_EXISTS);
            }
            const otp = (0, otp_1.generateOTP)();
            console.log('otp is', otp);
            const otpExpire = new Date(Date.now() + 60 * 1000);
            const hashedPassword = yield (0, hash_1.hashPassword)(password);
            const newPatient = {
                name,
                email,
                DOB: dob,
                phone,
                gender,
                password: hashedPassword,
                otp,
                otpExpire,
                isVerified: false,
                role: 'patients'
            };
            yield this.PatientRepo.create(newPatient);
            const mailService = new mail_service_1.MailService();
            yield mailService.sendMail(email, `Your OTP code`, `Hi ${name},\n\nYour OTP is : ${otp}\nIt will expire in 1 minit.`);
            return;
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.PatientRepo.findByEmail(email);
            if (!user) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.USER_NOT_FOUND);
            }
            yield this.PatientRepo.verifyOtp(email, otp);
            return { msg: ServiceMessage_1.SERVICE_MESSAGE.OTP_VERIFIED_SUCCESS };
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
            const user = yield this.PatientRepo.findByEmail(email);
            if (!user) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.USER_NOT_FOUND);
            }
            const newOTp = (0, otp_1.generateOTP)();
            const otpExpire = new Date(Date.now() + 60 * 1000);
            yield this.PatientRepo.upsertWithOTP(email, newOTp, otpExpire);
            const mailService = new mail_service_1.MailService();
            yield mailService.sendMail(email, 'Resend OTP code', `Hi ${user.name},\n\nYour New OTP code is ${newOTp}\n It will expire in 1 minit.`);
            return { msg: ServiceMessage_1.SERVICE_MESSAGE.RESEND_OTP_SUCCESS };
        });
    }
    verifiyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('1')
            let user = yield this.PatientRepo.findByEmail(email);
            if (!user) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.USER_NOT_FOUND);
            }
            console.log('user', user);
            const otp = (0, otp_1.generateOTP)();
            const otpExpire = new Date(Date.now() + 60 * 1000);
            tempUser_1.tempUserStore[email] = {
                email,
                otp,
                otpExpire: otpExpire
            };
            const mailService = new mail_service_1.MailService();
            yield mailService.sendMail(email, 'Password Change OTP code', `Hi ${user.name},\n\nYour OTP code is ${otp}\n It will expire in 1 minit.`);
            return { msg: ServiceMessage_1.SERVICE_MESSAGE.OTP_SEND_SUCCESS };
        });
    }
    verifyEmailOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.PatientRepo.findByEmail(email);
            if (!user) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.USER_NOT_FOUND);
            }
            yield this.PatientRepo.verifyOtp(email, otp);
            return { msg: ServiceMessage_1.SERVICE_MESSAGE.OTP_VERIFIED_SUCCESS };
        });
    }
    forgotPassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.PatientRepo.findByEmail(email);
            console.log('user is ', user);
            if (!user) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.USER_NOT_FOUND);
            }
            const hashedPassword = yield (0, hash_1.hashPassword)(newPassword);
            const updated = yield this.PatientRepo.updatePasswordWithEmail(email, hashedPassword);
            console.log('updated user is', updated);
            return { msg: ServiceMessage_1.SERVICE_MESSAGE.PASSWORD_UPDATE_SUCCESS };
        });
    }
}
exports.AuthService = AuthService;
