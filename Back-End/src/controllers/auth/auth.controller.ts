import { NextFunction, Request, Response } from "express";
import IAuthController from "../../interface/auth/auth.controller";
import { AuthService } from "../../services/auth/auth.service";
import { HttpStatus } from "../../utils/httpStatus";
import { CONTROLLER_MESSAGE } from "../../utils/controllerMessage";
import { verifyToken } from "../../utils/jwt";
 export class AuthController implements IAuthController{
  constructor(private authService : AuthService) {}


    async login(req: Request, res: Response): Promise<void> {
        try {
            const {email,password} = req.body;
             
            const data = await this.authService.login(email,password)

            res.status(HttpStatus.OK).json({data})
            
        } catch (error) {
            const err = error as Error

            res.status(HttpStatus.BAD_REQUEST).json({msg:err.message || CONTROLLER_MESSAGE.LOGIN_ERROR});
        }
    }
    async signup(req: Request, res: Response): Promise<void> {
        try {
            const {name,email,password,dob,gender,phone,confirmPassword,role} = req.body
            const result  = await this.authService.signup(name,email,password,phone,dob,gender,role)

            res.status(HttpStatus.CREATED).json({success:true,msg:CONTROLLER_MESSAGE.OTP_SEND_MESSAGE})
        } catch (error) {
            const err = error as Error
            console.log(err)
            res.status(HttpStatus.BAD_REQUEST).json({msg:err.message})
        }
    }
    async verifyOTP(req: Request, res: Response): Promise<void> {
        const {email,otp} = req.body

        try {
            const result = await this.authService.verifyOtp(email,otp);
           console.log('result is',result);
            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            const err = error as Error
            res.status(HttpStatus.UNAUTHORIZED).json({msg:err.message});
        }
    }

   async getMe(req: Request, res: Response): Promise<void> {
       try {
        const token = req.cookies.token
      
        const payload = verifyToken(token);
       
        res.status(HttpStatus.OK).json({token,user:payload})
       } catch (error) {
        res.status(HttpStatus.UNAUTHORIZED).json({msg:"invalid token"})
       }
   }
   async logOut(req: Request, res: Response): Promise<void> {
       try {
        await this.authService.logOut();

        res.clearCookie("token",{
            httpOnly:true,
            sameSite : 'lax',
            secure:false,
            path:'/'
        })
         res.status(HttpStatus.OK).json({msg:"log out success"})
       } catch (error) {
        res.status(500).json({msg : "log out failed"})
       }
   }

   async resendOTP(req: Request, res: Response): Promise<void> {
       const {email} = req.body

       try {
        const res = await this.authService.resendOTP(email)
        res.status(HttpStatus.OK).json(res)
       } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json('resend otp error');
       }
   }
   async verfiyEmail(req: Request, res: Response): Promise<void> {
       const {email} = req.body
       try {
        const result = await this.authService.verifiyEmail(email)
        console.log('res',result);
        res.status(HttpStatus.OK).json(result)
       } catch (error) {
        const err = error as Error
        res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
       }
   }
   async verifyEmailOTP(req: Request, res: Response): Promise<void> {
       const {email,otp} = req.body

       try {
        const result = await this.authService.verifyEmailOTP(email,otp);
        res.status(HttpStatus.OK).json(result)
       } catch (error) {
        const err = error as Error
        res.status(HttpStatus.UNAUTHORIZED).json({msg:err.message});
       }
   }
    async forgotPassword(req: Request, res: Response): Promise<void> {
    const {email,newPassword} = req.body
    console.log(email)
       try {
          const result = await this.authService.forgotPassword(email,newPassword);
              console.log(result)
          res.status(HttpStatus.OK).json(result);
       } catch (error) {
        const err = error as Error
        res.status(HttpStatus.UNAUTHORIZED).json({msg:err.message});
       }
   }
}