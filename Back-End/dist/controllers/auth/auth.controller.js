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
exports.AuthController = void 0;
const httpStatus_1 = require("../../utils/httpStatus");
const controllerMessage_1 = require("../../utils/controllerMessage");
const jwt_1 = require("../../utils/jwt");
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const data = yield this.authService.login(email, password);
                res.status(httpStatus_1.HttpStatus.OK).json({ data });
            }
            catch (error) {
                const err = error;
                res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ msg: err.message || controllerMessage_1.CONTROLLER_MESSAGE.LOGIN_ERROR });
            }
        });
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, dob, gender, phone, confirmPassword, role } = req.body;
                const result = yield this.authService.signup(name, email, password, phone, dob, gender, role);
                res.status(httpStatus_1.HttpStatus.CREATED).json({ success: true, msg: controllerMessage_1.CONTROLLER_MESSAGE.OTP_SEND_MESSAGE });
            }
            catch (error) {
                const err = error;
                console.log(err);
                res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ msg: err.message });
            }
        });
    }
    verifyOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, otp } = req.body;
            try {
                const result = yield this.authService.verifyOtp(email, otp);
                console.log('result is', result);
                res.status(httpStatus_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                const err = error;
                res.status(httpStatus_1.HttpStatus.UNAUTHORIZED).json({ msg: err.message });
            }
        });
    }
    getMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.token;
                const payload = (0, jwt_1.verifyToken)(token);
                res.status(httpStatus_1.HttpStatus.OK).json({ token, user: payload });
            }
            catch (error) {
                res.status(httpStatus_1.HttpStatus.UNAUTHORIZED).json({ msg: "invalid token" });
            }
        });
    }
    logOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authService.logOut();
                res.clearCookie("token", {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: false,
                    path: '/'
                });
                res.status(httpStatus_1.HttpStatus.OK).json({ msg: "log out success" });
            }
            catch (error) {
                res.status(500).json({ msg: "log out failed" });
            }
        });
    }
    resendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const res = yield this.authService.resendOTP(email);
                res.status(httpStatus_1.HttpStatus.OK).json(res);
            }
            catch (error) {
                res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json('resend otp error');
            }
        });
    }
    verfiyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const result = yield this.authService.verifiyEmail(email);
                console.log('res', result);
                res.status(httpStatus_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                const err = error;
                res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ msg: err.message });
            }
        });
    }
    verifyEmailOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, otp } = req.body;
            try {
                const result = yield this.authService.verifyEmailOTP(email, otp);
                res.status(httpStatus_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                const err = error;
                res.status(httpStatus_1.HttpStatus.UNAUTHORIZED).json({ msg: err.message });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, newPassword } = req.body;
            console.log(email);
            try {
                const result = yield this.authService.forgotPassword(email, newPassword);
                console.log(result);
                res.status(httpStatus_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                const err = error;
                res.status(httpStatus_1.HttpStatus.UNAUTHORIZED).json({ msg: err.message });
            }
        });
    }
}
exports.AuthController = AuthController;
