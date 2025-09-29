
import {Request,Response} from 'express';
export interface ICallLogController {
    getCallData(req:Request,res:Response):Promise<void>;
}