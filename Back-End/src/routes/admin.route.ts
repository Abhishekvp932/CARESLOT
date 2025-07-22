    import express from 'express'
import { AdminController } from '../controllers/admin/admin.controller'
import { AdminRepository } from '../repositories/admin/admin.repository'
import { DoctorRepository } from '../repositories/doctors/doctor.repository'
import { PatientRepository } from '../repositories/auth/auth.repository'
import { AdminService } from '../services/admin/admin.service'
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository'
import { protect } from '../middleware/auth.middleware'
const patientRepo = new PatientRepository()
const doctorRepo = new DoctorRepository()
const adminRepo = new AdminRepository()
const doctorAuthRepo = new DoctorAuthRepository()
const adminService = new AdminService(patientRepo,doctorRepo,adminRepo,doctorAuthRepo); 
const adminController = new AdminController(adminService);

const router = express.Router()

router.route('/users')
.get(protect,adminController.getAllUsers.bind(adminController))
router.route('/users/:id').
patch(protect,adminController.blockAndUnblockUsers.bind(adminController))
router.route('/doctors').get(protect,adminController.getAllDoctors.bind(adminController));
router.route('/doctors/:id').
patch(protect,adminController.blockAndUnblockDoctors.bind(adminController))
router.route('/doctor/:id').patch(protect,adminController.doctorApprove.bind(adminController))
.delete(adminController.doctorReject.bind(adminController));
router.route('/verification-list').
get(protect,adminController.findUnprovedDoctors.bind(adminController));
export default router
