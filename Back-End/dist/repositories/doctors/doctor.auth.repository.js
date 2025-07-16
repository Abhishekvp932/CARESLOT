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
exports.DoctorAuthRepository = void 0;
const doctor_model_1 = __importDefault(require("../../models/implementation/doctor.model"));
const ServiceMessage_1 = require("../../utils/ServiceMessage");
const base_repository_1 = require("../base.repository");
class DoctorAuthRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(doctor_model_1.default);
    }
    updateById(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(id, update, { new: true });
        });
    }
    upsertWithOTP(email, otp, otpExpire) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOneAndUpdate({ email }, { otp, otpExpire }, { upsert: true, new: true });
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield this.findByEmail(email);
            if (!doctor ||
                doctor.otp !== otp ||
                !doctor.otpExpire ||
                new Date() > new Date(doctor.otpExpire)) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.INVALID_OTP_EXPIRE_OTP);
            }
            doctor.otp = undefined;
            doctor.otpExpire = undefined;
            yield doctor.save();
            return true;
        });
    }
    findByGoogleId(googleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({ googleId });
        });
    }
    createWithGoogle(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const doctor = new doctor_model_1.default({
                googleId: profile.id,
                name: profile.displayName,
                email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
            });
            return yield doctor.save();
        });
    }
    updatePasswordWithEmail(email, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOneAndUpdate({ email }, { $set: { password: update } }, { new: true });
        });
    }
}
exports.DoctorAuthRepository = DoctorAuthRepository;
