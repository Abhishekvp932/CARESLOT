import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "035299e15d0ee0da0711d724761bb198";
const EXPIRE = "7d";

interface TokenPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const genarateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRE });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null
  }
};
