import { Request, Response, NextFunction } from 'express';
import { IWalletController } from '../../interface/wallet/IWalletController';
import { IWalletService } from '../../interface/wallet/IWalletService';
import logger from '../../utils/logger';
import { HttpStatus } from '../../utils/httpStatus';

export class WalletController implements IWalletController {
  constructor(private _walletService: IWalletService) {}

  /**
   * @remarks
   * Handles a GET request to retrieve user wallet data.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing the user wallet data.
   */

  async getUserWalletData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { patientId } = req.params;
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const result = await this._walletService.getUserWalletData(
        patientId,
        page,
        limit
      );
      logger.debug(result);
      res.status(HttpStatus.OK).json({
        data: result.walletHistory,
        balance: result?.balance,
        currentPage: page,
        totalPages: Math.ceil(result.total / limit),
        totalItem: result.total,
      });
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to retrieve doctor wallet data.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing the doctor wallet data.
   */

  async getDoctorWalletData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { doctorId } = req.params;
      logger.info('doctor wallet data request is comming');
      const result = await this._walletService.getDoctorWalletData(doctorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }
}
