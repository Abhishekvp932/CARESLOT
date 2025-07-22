import { Request,Response } from "express";

export default interface IAuthController{
    login(req:Request,res:Response):Promise<void>
    signup(req:Request,res:Response):Promise<void>
    verifyOTP(req:Request,res:Response):Promise<void>
    getMe(req:Request,res:Response) : Promise <void>
    logOut(req:Request,res:Response):Promise<void> 
    resendOTP(req:Request,res:Response):Promise<void> 
    verfiyEmail (req:Request,res:Response):Promise<void> 
    verifyEmailOTP(req:Request,res:Response):Promise<void> 
    forgotPassword(req:Request,res:Response):Promise<void> 
    refreshToken(req:Request,res:Response):Promise<void>
}