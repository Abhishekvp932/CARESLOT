import { Request, Response, NextFunction } from 'express';

export interface IChatController {
  getUserChat(req: Request, res: Response, next: NextFunction): Promise<void>;
  sendMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
  getDoctorChat(req: Request, res: Response, next: NextFunction): Promise<void>;
  getDoctorMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
  getPatientMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
}
