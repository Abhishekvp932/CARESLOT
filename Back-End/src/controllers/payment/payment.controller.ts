import { Request, Response } from 'express';
import { IPaymentController } from '../../interface/payment/IPaymentController';

import { IPaymentService } from '../../interface/payment/IPaymentService';
import logger from '../../utils/logger';
import { HttpStatus } from '../../utils/httpStatus';

export class PaymentController implements IPaymentController {
  constructor(private _paymentService: IPaymentService) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    logger.info('amount comming');

    try {
      const amount = parseInt(req.body.amount);
   

      const result = await this._paymentService.createOrder(amount);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async verifyOrder(req: Request, res: Response): Promise<void> {
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
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async walletPayment(req: Request, res: Response): Promise<void> {
    try {
      logger.info('wallet payment request is comming');
  //      doctorId: '68adb14d2a64e7098a71ebdd',
  // date: '2025-09-20',
  // startTime: '09:00',
  // endTime: '10:00',
  // patientId: '6891de87a60f4ac81f03e7df',
  // amount: 650
      const {doctorId,date,startTime,endTime,patientId,amount} = req.body; 
      const result = await this._paymentService.walletPayment(doctorId,date,startTime,endTime,patientId,amount);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
    }
  }
}
