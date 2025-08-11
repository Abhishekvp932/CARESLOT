    import { Request, Response, NextFunction } from "express";
    import { verifyAccessToken } from "../utils/jwt";
    import logger from "../utils/logger";
  import redisClient from "../config/redisClient";

    export const protect = async(req: Request, res: Response, next: NextFunction) => {
      try {
    
      const sessionId = req.cookies?.sessionId
      logger.debug('sesssion id',sessionId);
      if(!sessionId){
    
        res.status(401).json({ message: "NO_SESSION_ID" });
        return;
      }
        const accessToken = await redisClient.get(`access:${sessionId}`);


        if (!accessToken) {
          res.status(401).json({ message: "NO_ACCESS_TOKEN_OR_EXPIRED" });
          return;
        }
        

        const decoded = verifyAccessToken(accessToken);
           logger.debug("decoded",decoded);
        if(!decoded){
          res.status(401).json({message:"INVALID_OR_EXPIRED_TOKEN"});
          return;
        }
      req.user = decoded
        next();
        return;
      } catch (error) {
        res.status(500).json({ message: "SERVER_ERROR_AUTH" });
        return;
      }
    };
