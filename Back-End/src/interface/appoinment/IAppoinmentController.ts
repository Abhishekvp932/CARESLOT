import express,{Request,Response} from 'express';

export interface IAppoinmentController {
    createAppoinment(req:Request,res:Response):Promise<void>;
}