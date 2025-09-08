import { NextFunction, Request, Response } from 'express';
import IAuthController from '../../interface/auth/auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import { HttpStatus } from '../../utils/httpStatus';
import { CONTROLLER_MESSAGE } from '../../utils/controllerMessage';
import { verifyAccessToken } from '../../utils/jwt';
import { IService } from '../../interface/auth/IService.interface';
import redisClient from '../../config/redisClient';
import {v4 as uuidv4} from 'uuid';
import logger from '../../utils/logger';
 export class AuthController implements IAuthController{
  constructor(private _authService : IService) {}
    async login(req: Request, res: Response): Promise<void> {
        try {
            const {email,password} = req.body;
             
            const {user,accessToken,refreshToken,msg} = await this._authService.login(email,password);

            const sessionId = uuidv4();
            await redisClient.set(`access:${sessionId}`,accessToken,{EX:15*60});
            await redisClient.set(`refresh:${sessionId}`,refreshToken,{EX:7*24*60*60});
           
            res.cookie('sessionId',sessionId,{
                httpOnly:true,
                secure:false,
                sameSite:'lax',
                maxAge:7*24*60*60*1000
            });
            res.status(HttpStatus.OK).json({msg,user:{id:user,email:user.email,role:user.role}});
            
        } catch (error) {
            const err = error as Error;
            res.status(HttpStatus.BAD_REQUEST).json({msg:err.message || CONTROLLER_MESSAGE.LOGIN_ERROR});
        }
    }
    async signup(req: Request, res: Response): Promise<void> {
        try {
            const {name,email,password,dob,gender,phone,confirmPassword,role} = req.body;
            const result  = await this._authService.signup(name,email,password,phone,dob,gender,role);

            res.status(HttpStatus.CREATED).json({success:true,msg:CONTROLLER_MESSAGE.OTP_SEND_MESSAGE});
        } catch (error) {
            const err = error as Error;
           
            res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
        }
    }
    async verifyOTP(req: Request, res: Response): Promise<void> {
        const {email,otp} = req.body;

        try {
            const result = await this._authService.verifyOtp(email,otp);
            
            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            const err = error as Error;
            res.status(HttpStatus.UNAUTHORIZED).json({msg:err.message});
        }
    }

   async getMe(req: Request, res: Response): Promise<void> {
       try {
        const sessionId = req.cookies.sessionId;
        
        if(!sessionId){
            res.status(HttpStatus.UNAUTHORIZED).json({msg:'session id missing'});
            return;
        }
        const result = await this._authService.getMe({sessionId});
       
        res.status(HttpStatus.OK).json({user:result});
       } catch (error) {
        const err = error as Error;
        res.status(HttpStatus.UNAUTHORIZED).json({msg:err.message});
       }
   }
   async logOut(req: Request, res: Response): Promise<void> {
       try {
        
        const sessionId = req.cookies?.sessionId;
      
        
      const result =  await this._authService.logOut({sessionId});


            res.clearCookie('sessionId',{
                httpOnly:true,
                sameSite : 'lax',
                secure:false,
                path:'/'
            });
         res.status(HttpStatus.OK).json(result);
       } catch (error) {
       const err = error as Error;

       res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
       }
   }

   async resendOTP(req: Request, res: Response): Promise<void> {
       const {email} = req.body;

       try {
        const result = await this._authService.resendOTP(email);
        res.status(HttpStatus.OK).json(result);
       } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json('resend otp error');
       }
   }
   async verfiyEmail(req: Request, res: Response): Promise<void> {
       const {email} = req.body;
       try {
        const result = await this._authService.verifiyEmail(email);
         
        res.status(HttpStatus.OK).json(result);
       } catch (error) {
        const err = error as Error;
        res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
       }
   }
   async verifyEmailOTP(req: Request, res: Response): Promise<void> {
       const {email,otp} = req.body;

       try {
        const result = await this._authService.verifyEmailOTP(email,otp);
        res.status(HttpStatus.OK).json(result);
       } catch (error) {
        const err = error as Error;
        res.status(HttpStatus.UNAUTHORIZED).json({msg:err.message});
       }
   }
    async forgotPassword(req: Request, res: Response): Promise<void> {
    const {email,newPassword} = req.body;
       try {
          const result = await this._authService.forgotPassword(email,newPassword);
             
          res.status(HttpStatus.OK).json(result);
       } catch (error) {
        const err = error as Error;
        res.status(HttpStatus.UNAUTHORIZED).json({msg:err.message});
       }
   }
   async refreshToken(req: Request, res: Response): Promise<void> {
       try {
        const result = await this._authService.refreshAccessToken(req,res);
        // res.status(HttpStatus.OK).json(result)
       } catch (error) {
        const err = error as Error;
        res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
       }
   }
}