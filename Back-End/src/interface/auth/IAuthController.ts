/* eslint-disable semi */
import { Request, Response, NextFunction } from 'express';

export default interface IAuthController {
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  signup(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOTP(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMe(req: Request, res: Response, next: NextFunction): Promise<void>;
  logOut(req: Request, res: Response, next: NextFunction): Promise<void>;
  resendOTP(req: Request, res: Response, next: NextFunction): Promise<void>;
  verfiyEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyEmailOTP(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
}
