import "express";

declare module "express" {
  interface Request {
    user?: IUser;
  }
}

export interface AuthedRequest<T = any> extends Request {
  user?: IUser;
  body: T;
}

export type AuthedRequestHandler<T = any> = (
  req: AuthedRequest<T>,
  res: Response,
  next?: (err?: any) => void
) => any;
