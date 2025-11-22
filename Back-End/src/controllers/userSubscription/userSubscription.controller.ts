import { Request, Response, NextFunction } from 'express';
import { IUserSubscriptionController } from '../../interface/userSubscription/IUserSubscriptionController';
import { IUserSubscriptionService } from '../../interface/userSubscription/IUserSubscriptionService';
import logger from '../../utils/logger';
import { HttpStatus } from '../../utils/httpStatus';

export class UserSubscriptionController implements IUserSubscriptionController {
    constructor(private _userSubscriptionService:IUserSubscriptionService){}

   async findAllUserSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
       try {
        logger.info('find all user subscription request is comming');
        const page =Number(req.query.page);
        const limit =Number(req.query.limit);


        const result = await this._userSubscriptionService.findAllUserSubscription(page,limit);
        logger.debug(result);
        res.status(HttpStatus.OK).json({
            data:result.subscription,
            currentPage:page,
            totalPages: Math.ceil(result.total / limit),
            totalItem: result.total,
        });
       } catch (error) {
        next(error);
       }
   }
}