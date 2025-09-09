import express, { Router } from "express";

import { getUser, getUsers } from "@/controllers";
import { protectRoute, validate } from "@/middleware";
import {
  getUserSchema,
  getUsersQuerySchema,
} from "../validators/user.validator.js";

const router: Router = express.Router();

router.get(
  "/",
  protectRoute,
  validate({ query: getUsersQuerySchema }),
  getUsers,
);
router.get("/:id", protectRoute, validate({ params: getUserSchema }), getUser);

export default router;
