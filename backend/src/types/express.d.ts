import "express";
import { UserDocument } from "./models/user";

declare module "express" {
  interface Request {
    user?: UserDocument;
  }
}
