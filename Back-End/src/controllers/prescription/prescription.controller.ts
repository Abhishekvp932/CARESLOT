import { Request, Response, NextFunction } from 'express';
import { IPrescriptionController } from '../../interface/prescription/IPrescriptionController.';
import logger from '../../utils/logger';
import { IPrescriptionService } from '../../interface/prescription/IPrescriptionService';
import { HttpStatus } from '../../utils/httpStatus';
export class PrescriptionController implements IPrescriptionController {
    constructor(private _prescriptionService:IPrescriptionService){}


    /**
     * @remarks
     * Handles a POST request to add a new prescription.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next function.
     * @returns A success message.
     */

    async addPrescription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info('prescription request is comming');
            const {diagnosis,medicines,advice,appoinmentId,patientId,doctorId} = req.body;
            const result = await this._prescriptionService.addPrescription(diagnosis,medicines,advice,appoinmentId,patientId,doctorId);
            res.status(HttpStatus.CREATED).json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @remarks
     * Handles a GET request to download a prescription.
     *
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next function.
     * @returns A PDF file of the prescription.
     */

    async downloadPrescription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {appoinmentId} = req.params;
            const result = await this._prescriptionService.downloadPrescription(appoinmentId);
             res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=prescription-${appoinmentId}.pdf`
            );
            res.send(result);
        } catch (error) {
            next(error as Error);
        }
    }
}