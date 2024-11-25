import { Request, Response } from "express";

// Declare module augmentation for express
declare global {
  namespace Express {
    interface Request {
      sessionId?: string; // Add sessionId property to the Request object
    }
  }
}