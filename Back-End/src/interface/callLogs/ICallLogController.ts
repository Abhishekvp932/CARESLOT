
import {Request,Response,NextFunction} from 'express';
export interface ICallLogController {
    getCallData(req:Request,res:Response,next:NextFunction):Promise<void>;
}