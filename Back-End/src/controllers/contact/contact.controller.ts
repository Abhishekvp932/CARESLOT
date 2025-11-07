import { NextFunction, Request, Response } from 'express';
import { IContactController } from '../../interface/contact/IContactController';
import { IContactService } from '../../interface/contact/IContactService';
import { HttpStatus } from '../../utils/httpStatus';
import logger from '../../utils/logger';

export class ContactController implements IContactController {
  constructor(private _contactService: IContactService) {}

  /**
   * @remarks
   * Handles a POST request to create new Contact information.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */

  async createContactInformation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const senderName = req.query.name as string;
      const senderEmail = req.query.email as string;
      const senderPhone = req.query.phone as string;
      const message = req.query.message as string;

      const result = await this._contactService.createContactInfromation(
        senderName,
        senderEmail,
        senderPhone,
        message
      );
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to retrieve all contacts infromation  from the database.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing all contacts datas.
   */
  async getContactsData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('get contact request is comming .......');
      const search = req.query.search as string;
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const result = await this._contactService.getContactData(
        search,
        page,
        limit
      );
 
      res.status(HttpStatus.OK).
      json({data:result.contacts,currentPage:page,totalPages: Math.ceil(result.total / limit), totalItem: result.total});
    } catch (error) {
      next(error);
    }
  }
}
