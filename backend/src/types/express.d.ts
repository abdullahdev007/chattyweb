import "express";
import { UserDocument } from "./models/user.js";

declare module "express" {
  interface Request {
    user?: UserDocument;
  }
}
