import express, { Router } from "express";

import { getUser, getUsers } from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import { validate } from "../middleware/validate.js";
import { getUserSchema } from "../validators/user.validator.js";

const router: Router = express.Router();

router.get("/", protectRoute , getUsers);
router.get("/:id", protectRoute,validate({params: getUserSchema}), getUser);

export default router;
