import express from 'express';
import { RatingController } from '../controllers/ratings/rating.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { PatientRepository } from '../repositories/auth/auth.repository';
import { RatingService } from '../services/ratings/rating.service';
import { Routers } from '../utils/Routers';
import { RatingRepository } from '../repositories/ratings/rating.repository';

const ratingRepository = new RatingRepository();
const doctorRepository = new DoctorAuthRepository();
const patientRepository = new PatientRepository();
const ratingService = new RatingService(ratingRepository,doctorRepository,patientRepository);


const ratingController = new RatingController(ratingService);
const authMiddleware = new AuthMiddleware(patientRepository,doctorRepository);


const router = express.Router();
router.route(Routers.ratingRouters.addRating)
.post(authMiddleware.protect,authMiddleware.isBlockedOrNot,ratingController.addRating.bind(ratingController));

router.route(Routers.ratingRouters.findDoctorRating)
.get(authMiddleware.protect,authMiddleware.isBlockedOrNot,ratingController.findDoctorRating.bind(ratingController));


export default router;
