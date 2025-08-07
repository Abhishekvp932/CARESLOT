import { NextFunction, Request, Response } from "express";
import IAuthController from "../../interface/auth/auth.controller";
import { AuthService } from "../../services/auth/auth.service";
import { HttpStatus } from "../../utils/httpStatus";
import { CONTROLLER_MESSAGE } from "../../utils/controllerMessage";
import { verifyAccessToken } from "../../utils/jwt";
import { IService } from "../../interface/auth/IService.interface";
 export class AuthController implements IAuthController{
  constructor(private _authService : IService) {}


    async login(req: Request, res: Response): Promise<void> {
        try {
            const {email,password} = req.body;
             
            const {user,accessToken,refreshToken,msg} = await this._authService.login(email,password)
            res.cookie('accessToken',accessToken,{
                httpOnly:true,
                secure:false,
                sameSite:"lax",
                maxAge: 15 * 60 * 1000,
            })

              res.cookie("refreshToken",refreshToken,{
                httpOnly:true,
                secure:false,
                sameSite:"lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
              })

            res.status(HttpStatus.OK).json({msg,user:{id:user,email:user.email,role:user.role}});
            
        } catch (error) {
            const err = error as Error

            res.status(HttpStatus.BAD_REQUEST).json({msg:err.message || CONTROLLER_MESSAGE.LOGIN_ERROR});
        }
    }
    async signup(req: Request, res: Response): Promise<void> {
        try {
            const {name,email,password,dob,gender,phone,confirmPassword,role} = req.body
            const result  = await this._authService.signup(name,email,password,phone,dob,gender,role)

            res.status(HttpStatus.CREATED).json({success:true,msg:CONTROLLER_MESSAGE.OTP_SEND_MESSAGE})
        } catch (error) {
            const err = error as Error
           
            res.status(HttpStatus.BAD_REQUEST).json({msg:err.message})
        }
    }
    async verifyOTP(req: Request, res: Response): Promise<void> {
        const {email,otp} = req.body

        try {
            const result = await this._authService.verifyOtp(email,otp);
            
            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            const err = error as Error
            res.status(HttpStatus.UNAUTHORIZED).json({msg:err.message});
        }
    }

   async getMe(req: Request, res: Response): Promise<void> {
       try {
        const token = req.cookies.token
      
        const payload = verifyAccessToken(token);
       
        res.status(HttpStatus.OK).json({token,user:payload})
       } catch (error) {
        res.status(HttpStatus.UNAUTHORIZED).json({msg:"invalid token"})
       }
   }
   async logOut(req: Request, res: Response): Promise<void> {
       try {
        await this._authService.logOut();

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
        const res = await this._authService.resendOTP(email)
        res.status(HttpStatus.OK).json(res)
       } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json('resend otp error');
       }
   }
   async verfiyEmail(req: Request, res: Response): Promise<void> {
       const {email} = req.body
       try {
        const result = await this._authService.verifiyEmail(email)
         
        res.status(HttpStatus.OK).json(result)
       } catch (error) {
        const err = error as Error
        res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
       }
   }
   async verifyEmailOTP(req: Request, res: Response): Promise<void> {
       const {email,otp} = req.body

       try {
        const result = await this._authService.verifyEmailOTP(email,otp);
        res.status(HttpStatus.OK).json(result)
       } catch (error) {
        const err = error as Error
        res.status(HttpStatus.UNAUTHORIZED).json({msg:err.message});
       }
   }
    async forgotPassword(req: Request, res: Response): Promise<void> {
    const {email,newPassword} = req.body
       try {
          const result = await this._authService.forgotPassword(email,newPassword);
             
          res.status(HttpStatus.OK).json(result);
       } catch (error) {
        const err = error as Error
        res.status(HttpStatus.UNAUTHORIZED).json({msg:err.message});
       }
   }
   async refreshToken(req: Request, res: Response): Promise<void> {
       try {
        const result = await this._authService.refreshAccessToken(req,res);
        // res.status(HttpStatus.OK).json(result)
       } catch (error) {
        const err = error as Error
        res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
       }
   }
}