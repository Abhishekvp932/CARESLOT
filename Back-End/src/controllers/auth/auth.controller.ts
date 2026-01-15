import { Request, Response, NextFunction } from 'express';
import IAuthController from '../../interface/auth/IAuthController';

import { HttpStatus } from '../../utils/httpStatus';

import { IAuthService } from '../../interface/auth/IAuthService';
import redisClient from '../../config/redisClient';
import { v4 as uuidv4 } from 'uuid';

import dotenv from 'dotenv';
dotenv.config();

export class AuthController implements IAuthController {
  constructor(private _authService: IAuthService) {}


      /**
   * @remarks
   * Handles a POST request to login a user.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing user information.
   */



  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const { user, accessToken, refreshToken, msg } =
        await this._authService.login(email, password);

      const sessionId = uuidv4();
      await redisClient.set(`access:${sessionId}`, accessToken, {
        EX: Number(process.env.ACCESS_TOKEN_EXPIRE_TIME),
      });
      await redisClient.set(`refresh:${sessionId}`, refreshToken, {
        EX: Number(process.env.REFRESH_TOKEN_EXPIRE_TIME),
      });

      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: Number(process.env.REDIS_SESSION_MAX_AGE),
      });
      res
        .status(HttpStatus.OK)
        .json({ msg, user: { id: user, email: user.email, role: user.role } });
    } catch (error) {
      next(error as Error);
    }
  }

        /**
   * @remarks
   * Handles a POST request to create a new user.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */


  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password, dob, gender, phone, role } = req.body;
      const result = await this._authService.signup(
        name,
        email,
        password,
        phone,
        dob,
        gender,
        role
      );

      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error as Error);
    }
  }
  async verifyOTP(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, otp } = req.body;

    try {
      const result = await this._authService.verifyOtp(email, otp);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

/**
 * @remarks
 * Handles a GET request to retrieve the current user's information.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 * @returns JSON response containing user information.
 */
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.cookies.sessionId;

      if (!sessionId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ msg: 'session id missing' });
        return;
      }
      const result = await this._authService.getMe({ sessionId });

      res.status(HttpStatus.OK).json({ user: result });
    } catch (error) {
      next(error as Error);
    }
  }


  /**
   * @remarks
   * Handles a POST request to log out a user.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */

  async logOut(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.cookies?.sessionId;

      const result = await this._authService.logOut({ sessionId });

      res.clearCookie('sessionId', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/',
      });
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }


    /**
   * @remarks
   * Handles a POST request to get new otp.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */


  async resendOTP(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email } = req.body;

    try {
      const result = await this._authService.resendOTP(email);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

      /**
   * @remarks
   * Handles a POST request to verify email address.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */


  async verfiyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email } = req.body;
    try {
      const result = await this._authService.verifiyEmail(email);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

/**
 * @remarks
 * Handles a POST request to verify email address.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 * @returns A success message.
 */

  async verifyEmailOTP(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, otp } = req.body;

    try {
      const result = await this._authService.verifyEmailOTP(email, otp);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }


  /**
   * @remarks
   * Handles a POST request to initiate the password reset process.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, newPassword } = req.body;
    try {
      const result = await this._authService.forgotPassword(email, newPassword);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

      /**
   * @remarks
   * Handles a POST request to genarate new access token and refresh token.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */


  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this._authService.refreshAccessToken(req, res);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }
}
