import { Request, Response, NextFunction } from "express";
import Joi from "joi";

type SchemaMap = {
  body?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
};

export const validate =
  (schemas: SchemaMap) =>
  (req: Request, res: Response, next: NextFunction) => {
    const locations: (keyof SchemaMap)[] = ["params", "query", "body"];
    for (const loc of locations) {
      if (schemas[loc]) {
        const { error, value } = schemas[loc]!.validate(req[loc], {
          stripUnknown: true,
          errors: { label: "key" },
        });
        if (error) {
          const errorMessage = error.details.map((d) => d.message).join("\n ");
          res.status(400).json({ success: false, message: errorMessage });
          return;
        }
        req[loc] = value; 
      }
    }

    next();
  };
