import { Request, Response } from 'express';
import { IWalletController } from '../../interface/wallet/IWalletController';
import { IWalletService } from '../../interface/wallet/IWalletService';
import logger from '../../utils/logger';
import { HttpStatus } from '../../utils/httpStatus';


export class WalletController implements IWalletController {
    constructor (private _walletService : IWalletService ){}

    async getUserWalletData(req: Request, res: Response): Promise<void> {
        try {
            const {patientId} = req.params;
           const page = Number(req.query.page);
           const limit = Number(req.query.limit) ;
            const result = await this._walletService.getUserWalletData(patientId,page,limit);
            logger.debug(result);
            res.status(HttpStatus.OK).json({data:result.walletHistory,balance:result?.balance,currentPage:page,totalPages: Math.ceil(result.total / limit),totalItem: result.total});
        } catch (error) {
            const err = error as Error;
            res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
        }
    }
}