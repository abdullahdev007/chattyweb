import express, { Router } from "express";

import { getUser, getUsers } from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router: Router = express.Router();

router.get("/", protectRoute, getUsers);
router.get("/:id", protectRoute, getUser);

export default router;
