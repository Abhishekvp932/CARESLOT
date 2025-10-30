import { Request, Response, NextFunction } from 'express';
import { IChatController } from '../../interface/chat/IChatController';
import { IChatService } from '../../interface/chat/IChatService';
import logger from '../../utils/logger';
import { HttpStatus } from '../../utils/httpStatus';
export class ChatController implements IChatController {
  constructor(private _chatService: IChatService) {}


    /**
   * @remarks
   * Handles a GET request to get user chat.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing user chat.
   */

  async getUserChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('get user chat request is comming');
      const { patientId } = req.params;
      const result = await this._chatService.getUserChat(patientId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a POST request to send a message.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing the result of the send message operation.
   */

  async sendMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('send message request is working?');
      const { chatId, content, sender, type } = req.body;

      let imageUrl = null;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files?.image?.[0]) {
        imageUrl = files.image[0].path;
      }

      const result = await this._chatService.sendMessage(
        chatId,
        content,
        sender,
        type,
        imageUrl as string
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to get doctor chat.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function. 
   * @returns JSON response containing doctor chat.
   */

  async getDoctorChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { doctorId } = req.params;
      const result = await this._chatService.getDoctorChat(doctorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to get doctor messages.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing doctor messages.
   */

  async getDoctorMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('doctor message fetching request is comming');
      const { chatId } = req.params;

      const result = await this._chatService.getDoctorMessage(chatId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to get patient messages.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing patient messages.
   */

  async getPatientMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('patient message fetching request is comming');
      const { chatId } = req.params;
      const result = await this._chatService.getPatientMessage(chatId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

       /**
   * @remarks
   * Handles a DELETE request to delete call logs.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   *  @param next - Express next function.
   * @returns JSON response indicating the result of the delete operation.
   */

  async deleteMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('delete message request is comming');
      const { messageId } = req.params;
      const result = await this._chatService.deleteMessage(messageId);
      res.status(HttpStatus.OK).json(result);
      return;
    } catch (error) {
      next(error as Error);
    }
  }
}
