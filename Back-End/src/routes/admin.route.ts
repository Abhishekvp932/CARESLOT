import express from 'express';
import { AdminController } from '../controllers/admin/admin.controller';
import { AdminRepository } from '../repositories/admin/admin.repository';

import { PatientRepository } from '../repositories/auth/auth.repository';
import { AdminService } from '../services/admin/admin.service';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { multiFileUpload } from '../middleware/multer.middleware';
import { AppoinmentRepository } from '../repositories/appoinment/appoinment.repository';
import { SlotRepository } from '../repositories/Slots/slot.repository';
import { Routers } from '../utils/Routers';
const patientRepository = new PatientRepository();

const adminRepository = new AdminRepository();
const doctorAuthRepository = new DoctorAuthRepository();
const appoinmentRepository = new AppoinmentRepository();
const slotRepository = new SlotRepository();
const adminService = new AdminService(
  patientRepository,
  adminRepository,
  doctorAuthRepository,
  appoinmentRepository,
  slotRepository,
);
const adminController = new AdminController(adminService);
const authMiddleware = new AuthMiddleware(patientRepository, doctorAuthRepository);
const router = express.Router();

router
  .route(Routers.adminRouters.users)
  .get(
    authMiddleware.protect,
    authMiddleware.authorizeRole('admin'),
    adminController.getAllUsers.bind(adminController)
  )
  .post(
    authMiddleware.protect,
    multiFileUpload,
    authMiddleware.authorizeRole('admin'),
    adminController.addUser.bind(adminController)
  );

router
  .route(Routers.adminRouters.usersId)
  .patch(
    authMiddleware.protect,
    authMiddleware.authorizeRole('admin'),
    adminController.blockAndUnblockUsers.bind(adminController)
  )
  .put(
    authMiddleware.protect,
    multiFileUpload,
    authMiddleware.authorizeRole('admin'),
    adminController.updateUserData.bind(adminController)
  );

router
  .route(Routers.adminRouters.doctors)
  .get(
    authMiddleware.protect,
    authMiddleware.authorizeRole('admin'),
    adminController.getAllDoctors.bind(adminController)
  )
  .post(
    authMiddleware.protect,
    multiFileUpload,
    authMiddleware.authorizeRole('admin'),
    adminController.addDoctor.bind(adminController)
  );

router
  .route(Routers.adminRouters.doctorsId)
  .patch(
    authMiddleware.protect,
    authMiddleware.authorizeRole('admin'),
    adminController.blockAndUnblockDoctors.bind(adminController)
  )
  .get(
    authMiddleware.protect,
    authMiddleware.authorizeRole('admin'),
    adminController.editDoctorData.bind(adminController)
  );


router
  .route(Routers.adminRouters.doctorId)
  .patch(
    authMiddleware.protect,
    authMiddleware.authorizeRole('admin'),
    adminController.doctorApprove.bind(adminController)
  )
  .put(adminController.doctorReject.bind(adminController));

router
  .route(Routers.adminRouters.verificationList)
  .get(
    authMiddleware.protect,
    authMiddleware.authorizeRole('admin'),
    adminController.findUnprovedDoctors.bind(adminController)
  );

router
  .route(Routers.adminRouters.doctorDetails)
  .get(
    authMiddleware.protect,
    authMiddleware.authorizeRole('admin'),
    adminController.getVerificationDoctorDetails.bind(adminController)
  );

router
  .route(Routers.adminRouters.appoinments)
  .get(
    authMiddleware.protect,
    authMiddleware.authorizeRole('admin'),
    adminController.getAllAppoinments.bind(adminController)
  );

  router.route(Routers.adminRouters.slotsAndAppoinments)
  .get(authMiddleware.protect,adminController.getDoctorSlotAndAppoinment.bind(adminController));
export default router;
