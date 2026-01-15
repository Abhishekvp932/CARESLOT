import express from 'express';
import { DoctorController } from '../controllers/doctors/doctor.controller';
import { DoctorService } from '../services/doctor/doctor.service';
import { PatientRepository } from '../repositories/auth/auth.repository';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { multiFileUpload } from '../middleware/multer.middleware';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { AppoinmentRepository } from '../repositories/appoinment/appoinment.repository';
import { Routers } from '../utils/Routers';
const router = express.Router();

const patientRepository = new PatientRepository();
const doctorAuthRepository = new DoctorAuthRepository();
const appoinmentRepository = new AppoinmentRepository();
const doctorService = new DoctorService(
  patientRepository,
  doctorAuthRepository,
  appoinmentRepository
);

const doctorController = new DoctorController(doctorService);
const authMiddleware = new AuthMiddleware(
  patientRepository,
  doctorAuthRepository
);

router.post(
  Routers.doctorRouters.kycSubmit,
  multiFileUpload,
  doctorController.uploadDocuments.bind(doctorController)
);
router
  .route(Routers.doctorRouters.profile)
  .get(
    authMiddleware.protect,
    doctorController.getDoctorProfile.bind(doctorController)
  )
  .put(
    authMiddleware.protect,
    multiFileUpload,
    doctorController.editDoctorProfile.bind(doctorController)
  );

router
  .route(Routers.doctorRouters.reApply)
  .put(
    authMiddleware.protect,
    multiFileUpload,
    doctorController.reApplyDoctor.bind(doctorController)
  );

router
  .route(Routers.doctorRouters.appoinments)
  .get(
    authMiddleware.protect,
    authMiddleware.isBlockedOrNot,
    doctorController.getAllAppoinments.bind(doctorController)
  );


router
    .route(Routers.doctorRouters.dashboardData)
    .get(
      authMiddleware.protect,
      authMiddleware.isBlockedOrNot,
      doctorController.getDoctorDashboardData.bind(doctorController)
    );
export default router;
