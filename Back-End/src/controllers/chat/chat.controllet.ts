import { Request, Response } from 'express';
import { IChatController } from '../../interface/chat/IChatController';
import { IChatService } from '../../interface/chat/IChatService';
import logger from '../../utils/logger';
import { HttpStatus } from '../../utils/httpStatus';
export class ChatController implements IChatController {
  constructor(private _chatService: IChatService) {}

  async getUserChat(req: Request, res: Response): Promise<void> {
    try {
      logger.info('get user chat request is comming');
      const { patientId } = req.params;
      const result = await this._chatService.getUserChat(patientId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async sendMessage(req: Request, res: Response): Promise<void> {
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
      const err = error as Error;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: err.message });
    }
  }

  async getDoctorChat(req: Request, res: Response): Promise<void> {
    try {
      const { doctorId } = req.params;
      const result = await this._chatService.getDoctorChat(doctorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: err.message });
    }
  }
  async getDoctorMessage(req: Request, res: Response): Promise<void> {
    try {
      logger.info('doctor message fetching request is comming');
      const { chatId } = req.params;

      const result = await this._chatService.getDoctorMessage(chatId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async getPatientMessage(req: Request, res: Response): Promise<void> {
    try {
      logger.info('patient message fetching request is comming');
      const { chatId } = req.params;
      const result = await this._chatService.getPatientMessage(chatId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async deleteMessage(req: Request, res: Response): Promise<void> {
      try {
        logger.info('delete message request is comming');
        const {messageId} = req.params;
        const result = await this._chatService.deleteMessage(messageId);
        res.status(HttpStatus.OK).json(result);
        return;
      } catch (error) {
        const err = error as Error;
        res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
      }
  }
}
