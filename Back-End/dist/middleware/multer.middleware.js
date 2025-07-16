"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiFileUpload = void 0;
const multer_config_1 = require("../config/multer.config");
exports.multiFileUpload = multer_config_1.cloudUpload.fields([
    { name: 'educationCertificate', maxCount: 1 },
    { name: 'experienceCertificate', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
]);
