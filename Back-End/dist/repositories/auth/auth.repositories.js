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
const patient_model_1 = __importDefault(require("../../models/patient/patient.model"));
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
}
exports.PatientRepository = PatientRepository;
