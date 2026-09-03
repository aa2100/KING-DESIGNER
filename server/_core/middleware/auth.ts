import { verifyToken, getUserById } from "../auth";
import type { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  userId?: number;
  user?: any;
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "No token provided" });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid token" });
  }

  const user = await getUserById(payload.userId);
  if (!user) {
    return res.status(404).json({ code: "NOT_FOUND", message: "User not found" });
  }

  if (user.isBanned) {
    return res.status(403).json({ code: "FORBIDDEN", message: "User is banned" });
  }

  req.userId = user.id;
  req.user = user;
  next();
}

export async function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user?.isAdmin || req.user?.publicId !== "king_10000") {
    return res.status(403).json({ code: "FORBIDDEN", message: "Admin access required" });
  }
  next();
}