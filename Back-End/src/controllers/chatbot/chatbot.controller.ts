import { Request, Response } from 'express';
import { IChatbotController } from '../../interface/chatbot/IChatbot.controller';
import { ChatbotService } from '../../services/chatbot/chatbot.service';
import { HttpStatus } from '../../utils/httpStatus';
import logger from '../../utils/logger';
export class ChatbotController implements IChatbotController {
  constructor(private _chatbotService: ChatbotService) {}

  async handleChatMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body;
      logger.info('message is comming');
      logger.debug(message);
      const result = await this._chatbotService.processMessage(message);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
}
