import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export const protect = (req: Request, res: Response, next: NextFunction):void => {
  try {
 
   const token = req.cookies?.accessToken
   console.log("token",token);
   if(!token){
     res.status(401).json({ message: "NO_TOKEN_IN_COOKIE" });
     return;
   }
    const decoded = verifyAccessToken(token);

    if (!decoded) {
       res.status(401).json({ message: "INVALID_OR_EXPIRED_TOKEN" });
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
