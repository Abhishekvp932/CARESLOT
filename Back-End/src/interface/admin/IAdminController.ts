/* eslint-disable semi */
import { Request,Response } from 'express';
export default interface IAdminController {
    getAllUsers(req:Request,res:Response):Promise<void>;
    getAllDoctors(req:Request,res:Response):Promise<void>;
    blockAndUnblockUsers(req:Request,res:Response):Promise<void>;
    blockAndUnblockDoctors(req:Request,res:Response):Promise<void>;
    findUnprovedDoctors(req:Request,res:Response):Promise<void>;
    doctorApprove(req:Request,res:Response):Promise<void>;
    doctorReject(req:Request,res:Response):Promise<void>;
    getVerificationDoctorDetails(req:Request,res:Response):Promise<void>;
    updateUserData(req:Request,res:Response):Promise<void>;
    editDoctorData(req:Request,res:Response):Promise<void>;
    addUser(req:Request,res:Response):Promise<void>;
    addDoctor(req:Request,res:Response):Promise<void>;
    getAllAppoinments(req:Request,res:Response):Promise<void>;
    getDoctorSlotAndAppoinment(req:Request,res:Response):Promise<void>;
}