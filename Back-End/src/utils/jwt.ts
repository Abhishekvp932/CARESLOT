import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || '035299e15d0ee0da0711d724761bb198'
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || '33333035299e15d0ee0da0711d724761bb198'

const ACCESS_EXPIRE = "15m";   
const REFRESH_EXPIRE = "7d";   

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}


export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRE });
};


export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRE });
};


export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};


export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};
