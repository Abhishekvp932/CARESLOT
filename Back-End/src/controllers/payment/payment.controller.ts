import { Request, Response, NextFunction } from 'express';
import { IPaymentController } from '../../interface/payment/IPaymentController';

import { IPaymentService } from '../../interface/payment/IPaymentService';
import logger from '../../utils/logger';
import { HttpStatus } from '../../utils/httpStatus';

export class PaymentController implements IPaymentController {
  constructor(private _paymentService: IPaymentService) {}


  /**
   * @remarks
   * Handles a POST request to create a new order.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing the created order details.
   */

  async createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    logger.info('amount comming');

    try {
      const amount = parseInt(req.body.amount);

      const result = await this._paymentService.createOrder(amount);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a POST request to verify an order.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing the verification result.
   */

  async verifyOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('data comming in verify order');
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        doctorId,
        patientId,
        date,
        startTime,
        endTime,
        amount,
        paymentMethod,
      } = req.body;
      logger.debug(req.body);

      const result = await this._paymentService.verifyOrder(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        doctorId,
        patientId,
        date,
        startTime,
        endTime,
        amount,
        paymentMethod
      );

      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error as Error);
    }
  }


  /**
   * @remarks
   * Handles a POST request to process wallet payments.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */

  async walletPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('wallet payment request is comming');
      const { doctorId, date, startTime, endTime, patientId, amount } =
        req.body;
      const result = await this._paymentService.walletPayment(
        doctorId,
        date,
        startTime,
        endTime,
        patientId,
        amount
      );
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error as Error);
    }
  }
}
