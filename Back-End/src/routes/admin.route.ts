    import express from 'express';
import { AdminController } from '../controllers/admin/admin.controller';
import { AdminRepository } from '../repositories/admin/admin.repository';

import { PatientRepository } from '../repositories/auth/auth.repository';
import { AdminService } from '../services/admin/admin.service';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { multiFileUpload } from '../middleware/multer.middleware';
const patientRepo = new PatientRepository();

const adminRepo = new AdminRepository();
const doctorAuthRepo = new DoctorAuthRepository();
const adminService = new AdminService(patientRepo,adminRepo,doctorAuthRepo); 
const adminController = new AdminController(adminService);
const authMiddleware = new AuthMiddleware(patientRepo,doctorAuthRepo);
const router = express.Router();

router.route('/users')
.get(authMiddleware.protect,adminController.getAllUsers.bind(adminController))
.post(authMiddleware.protect,multiFileUpload,adminController.addUser.bind(adminController));

router.route('/users/:id').
patch(authMiddleware.protect,adminController.blockAndUnblockUsers.bind(adminController)).
put(authMiddleware.protect,multiFileUpload,adminController.updateUserData.bind(adminController));


router.route('/doctors')
.get(authMiddleware.protect,adminController.getAllDoctors.bind(adminController))
.post(authMiddleware.protect,multiFileUpload,adminController.addDoctor.bind(adminController));



router.route('/doctors/:id').
patch(authMiddleware.protect,adminController.blockAndUnblockDoctors.bind(adminController))
.get(authMiddleware.protect,adminController.editDoctorData.bind(adminController)).
put(authMiddleware.protect,multiFileUpload,adminController.editDoctorProfile.bind(adminController));



router.route('/doctor/:id').patch(authMiddleware.protect,adminController.doctorApprove.bind(adminController))
.put(adminController.doctorReject.bind(adminController));


router.route('/verification-list').
get(authMiddleware.protect,adminController.findUnprovedDoctors.bind(adminController));


router.route('/doctor-details/:id').get(authMiddleware.protect,adminController.getVerificationDoctorDetails.bind(adminController));
export default router;
