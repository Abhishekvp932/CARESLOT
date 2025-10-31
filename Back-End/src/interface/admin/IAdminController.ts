/* eslint-disable semi */
import { Request, Response, NextFunction } from 'express';
export default interface IAdminController {
    getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllDoctors(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockAndUnblockUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockAndUnblockDoctors(req: Request, res: Response, next: NextFunction): Promise<void>;
    findUnprovedDoctors(req: Request, res: Response, next: NextFunction): Promise<void>;
    doctorApprove(req: Request, res: Response, next: NextFunction): Promise<void>;
    doctorReject(req: Request, res: Response, next: NextFunction): Promise<void>;
    getVerificationDoctorDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateUserData(req: Request, res: Response, next: NextFunction): Promise<void>;
    editDoctorData(req: Request, res: Response, next: NextFunction): Promise<void>;
    addUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    addDoctor(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllAppoinments(req: Request, res: Response, next: NextFunction): Promise<void>;
    getDoctorSlotAndAppoinment(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAdminDashboardData(req:Request,res:Response,next:NextFunction):Promise<void>;
}
