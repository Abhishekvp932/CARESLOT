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
exports.DoctorService = void 0;
const ServiceMessage_1 = require("../../utils/ServiceMessage");
const mail_service_1 = require("../mail.service");
class DoctorService {
    constructor(doctorRepo, patientRepo, authDoctor) {
        this.doctorRepo = doctorRepo;
        this.patientRepo = patientRepo;
        this.authDoctor = authDoctor;
    }
    uploadDocument(doctorId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield this.authDoctor.findById(doctorId);
            if (!doctor) {
                throw new Error(ServiceMessage_1.SERVICE_MESSAGE.USER_NOT_FOUND);
            }
            yield this.doctorRepo.uploadDocument(doctorId, input);
            const mailService = new mail_service_1.MailService();
            yield mailService.sendMail(doctor.email, "Your KYC Documents Have Been Received – CareSlot", `Dear Dr. ${doctor.name},

Thank you for submitting your KYC documents to CareSlot. 🩺  
We’ve successfully received your qualification and experience certificates.

Our admin team will now review your documents.  
You’ll be notified once your profile is approved and activated.

✅ Submission Date: ${new Date().toLocaleDateString()}

If you have any questions, feel free to contact our support team careslot@gmail.com.

Best regards,  
The CareSlot Team`);
            return { msg: "Document uploaded successfully", doctor };
        });
    }
}
exports.DoctorService = DoctorService;
