import { Request,Response } from "express";

export default interface  IDoctorController {
    uploadDocuments(req:Request,res:Response):Promise<void>;
    getDoctorProfile(req:Request,res:Response):Promise<void>;
    editDoctorProfile(req:Request,res:Response):Promise<void>;
}