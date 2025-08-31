import express, { Router } from "express";

import { getUser, getUsers } from "@/controllers";
import { protectRoute, validate } from "@/middleware";
import { getUserSchema } from "../validators/user.validator.js";

const router: Router = express.Router();

router.get("/", protectRoute, getUsers);
router.get("/:id", protectRoute, validate({ params: getUserSchema }), getUser);

export default router;
