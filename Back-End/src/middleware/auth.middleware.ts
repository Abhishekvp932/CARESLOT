    import { Request, Response, NextFunction } from 'express';
    import { verifyAccessToken } from '../utils/jwt';
    import logger from '../utils/logger';
  import redisClient from '../config/redisClient';
import { HttpStatus } from '../utils/httpStatus';
import { IpatientRepository } from '../interface/auth/auth.interface';
import { IDoctorAuthRepository } from '../interface/doctor/doctor.auth.interface';
   import { IBaseUser } from '../utils/IBaseUser';

export class AuthMiddleware {
  constructor (private _patientRepo:IpatientRepository,private _doctorRepo:IDoctorAuthRepository){}
  public protect = async(req: Request, res: Response, next: NextFunction) => {
      try {
    
      const sessionId = req.cookies?.sessionId;
      logger.debug('sesssion id',sessionId);
      if(!sessionId){
    
        res.status(401).json({ message: 'NO_SESSION_ID' });
        return;
      }
        const accessToken = await redisClient.get(`access:${sessionId}`);


        if (!accessToken) {
          res.status(401).json({ message: 'NO_ACCESS_TOKEN_OR_EXPIRED' });
          return;
        }
         
        const isBlacklisted = await redisClient.get(`bl_access:${accessToken}`);

        if(isBlacklisted){
           res.status(HttpStatus.UNAUTHORIZED).json({msg:'Token blackListed'});
           return;
        }
        
        const decoded = verifyAccessToken(accessToken);

           logger.debug('decoded',decoded);
        if(!decoded){
          res.status(401).json({message:'INVALID_OR_EXPIRED_TOKEN'});
          return;
        }
      req.user = decoded;
        next();
        return;
      } catch (error) {
        res.status(500).json({ message: 'SERVER_ERROR_AUTH' });
        return;
      }
    };
      
      public isBlockedOrNot = async(req:Request,res:Response,next:NextFunction)=>{
        try {
          
          const sessionId = req.cookies?.sessionId;

          if(!sessionId){
            res.status(HttpStatus.UNAUTHORIZED).json({msg:'No_SESSION_ID'});
            return;
          }
            
          const accessToken = await redisClient.get(`access:${sessionId}`);
          if(!accessToken){
            res.status(HttpStatus.UNAUTHORIZED).json({msg:'Token_Missing'});
            return;
          }

          const isBlackedListed = await redisClient.get(`bl_access:${accessToken}`);

          if(isBlackedListed){
            res.status(HttpStatus.UNAUTHORIZED).json({msg:'Token black listed'});
            return;
          }

          const decode = verifyAccessToken(accessToken);
          if(!decode){
            res.status(HttpStatus.UNAUTHORIZED).json({msg:'INVALID_OR_EXPIRED_TOKEN'});

            return;
          }
          let user:IBaseUser | null = null;
          
          user= (await this._patientRepo.findById(decode?.id)) as IBaseUser | null;
          let role = 'patients';

          if(!user){
            user = await (this._doctorRepo.findById(decode?.id)) as IBaseUser | null;
            role = 'doctors';
          }

          if(!user){
            res.status(HttpStatus.NOT_FOUND).json({msg:'user not found'});
            return;
          }

          if(user?.isBlocked === true){
            res.status(HttpStatus.UNAUTHORIZED).json({msg:'This Accound is blocked'});
            return;
          }
          req.user = decode;
          next();        
        } catch (error) {
          res.status(500).json({ message: 'SERVER_ERROR_AUTH' });
          return;
        }
      };
  }