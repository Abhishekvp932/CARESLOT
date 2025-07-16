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
exports.PatientRepository = void 0;
const patient_model_1 = __importDefault(require("../models/implementation/patient.model"));
const ServiceMessage_1 = require("../utils/ServiceMessage");
class PatientRepository {
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield patient_model_1.default.findById(id);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield patient_model_1.default.findOne({ email: email });
        });
    }
    create(patientData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPatient = new patient_model_1.default(patientData);
            return yield newPatient.save();
        });
    }
    updateById(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield patient_model_1.default.findByIdAndUpdate(id, update, { new: true });
        });
    }
    upsertWithOTP(email, otp, otpExpire) {
        return __awaiter(this, void 0, void 0, function* () {
            return patient_model_1.default.findOneAndUpdate({ email }, { otp, otpExpire }, { upsert: true, new: true });
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield patient_model_1.default.findOne({ email: email });
            if (!user ||
                user.otp !== otp ||
                !user.otpExpire ||
                new Date() > new Date(user.otpExpire)) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.INVALID_OTP_EXPIRE_OTP);
            }
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpire = undefined;
            yield user.save();
            return true;
        });
    }
    findByGoogleId(googleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield patient_model_1.default.findOne({ googleId });
        });
    }
    createWithGoogle(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = new patient_model_1.default({
                googleId: profile.id,
                name: profile.displayName,
                email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
            });
            return yield user.save();
        });
    }
    updatePasswordWithEmail(email, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield patient_model_1.default.findOneAndUpdate({ email }, { $set: { password: update } }, { new: true });
        });
    }
}
exports.PatientRepository = PatientRepository;
