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
exports.MailService = void 0;
const mail_1 = require("../utils/mail");
class MailService {
    sendMail(to, subject, text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mail_1.transporter.sendMail({
                from: `"CareSlot" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                text,
            });
        });
    }
}
exports.MailService = MailService;
