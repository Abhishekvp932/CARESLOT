import { Request, Response, NextFunction } from 'express';
import { IChatbotController } from '../../interface/chatbot/IChatbot.controller';
import { ChatbotService } from '../../services/chatbot/chatbot.service';
import { HttpStatus } from '../../utils/httpStatus';
import logger from '../../utils/logger';
export class ChatbotController implements IChatbotController {
  constructor(private _chatbotService: ChatbotService) {}


  /**
   * @remarks
   * Handles a POST request to send a message to chat bot.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing the result of the send message operation.
   */

  async handleChatMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { message } = req.body;
      logger.info('message is comming');
      logger.debug(message);
      const result = await this._chatbotService.processMessage(message);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }
}
