import jwt from "jsonwebtoken";
import { Response } from "express";

const generateTokenAndSetCookie = (userId: string, res: Response): void => {
  const jwtSecret = process.env.JWT_SECRET || "";
  const token = jwt.sign({ userId }, jwtSecret);

  res.cookie("jwt", token, {
    secure: process.env.NODE_ENV !== "development",
    domain: process.env.domain,
    path: "/",
  });
};

export default generateTokenAndSetCookie;
