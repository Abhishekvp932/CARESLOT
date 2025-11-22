import { Request, Response, NextFunction } from 'express';
import { ISubscriptionController } from '../../interface/subscription/ISubscriptionController';
import logger from '../../utils/logger';
import { ISubcriptionService } from '../../interface/subscription/ISubscriptionService';
import { HttpStatus } from '../../utils/httpStatus';

export class SubscriptionController implements ISubscriptionController{
    constructor(private _subscriptionService:ISubcriptionService){}
    async createSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info('subscription create request is comming');
            const {name,price,discountAmount,durationInDays} = req.body;
            const result = await this._subscriptionService.createSubscription(name,price,discountAmount,durationInDays);
            res.status(HttpStatus.CREATED).json(result);
        } catch (error) {
            next(error);
        }
    }
    async getAllSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info('get all subscription request is comming');
            const result = await this._subscriptionService.getAllAdminSubscription();
            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {subscriptionId} = req.params;
            const result = await this._subscriptionService.deleteSubscription(subscriptionId);
            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            next(error);
        }
    }
    async getAllActiveSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info('acitve subscription request is comming');
            const result = await this._subscriptionService.getAllActiveSubscription();
            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            next(error);
        }
    }
}