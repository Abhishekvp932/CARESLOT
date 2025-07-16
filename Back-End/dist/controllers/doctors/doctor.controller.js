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
exports.DoctorController = void 0;
const httpStatus_1 = require("../../utils/httpStatus");
class DoctorController {
    constructor(doctorService) {
        this.doctorService = doctorService;
    }
    uploadDocuments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            console.log('controller recived');
            try {
                const files = req.files;
                console.log('files', files);
                const { id: doctorId } = req.params;
                if (!doctorId) {
                    res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ msg: "Doctor id missing" });
                }
                console.log('doctor id is showing', doctorId);
                const { degree, institution, experience, specialization, medicalSchool, graduationYear, about, fees, } = req.body;
                console.log('qualifications', req.body);
                const input = {
                    degree,
                    institution,
                    experience: Number(experience),
                    specialization,
                    medicalSchool,
                    graduationYear: Number(graduationYear),
                    about,
                    fees,
                    educationCertificate: ((_b = (_a = files.educationCertificate) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) || '',
                    experienceCertificate: ((_d = (_c = files.experienceCertificate) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path) || '',
                };
                const result = yield this.doctorService.uploadDocument(doctorId, input);
                res.status(httpStatus_1.HttpStatus.CREATED).json(result);
            }
            catch (error) {
                const err = error;
                res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ msg: 'qualification error msg' });
            }
        });
    }
}
exports.DoctorController = DoctorController;
