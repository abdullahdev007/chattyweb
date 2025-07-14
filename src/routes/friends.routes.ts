import express, { RequestHandler, Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  deleteFriend,
  getFriendRequests,
  getFriends,
  respondFriendRequest,
  sendFriendRequest,
} from "../controllers/friends.controller.js";

const router: Router = express.Router();

router.get("/", protectRoute, getFriends);

router.get("/requests", protectRoute, getFriendRequests);

router.post(
  "/send-request/:id",
  protectRoute,
  sendFriendRequest as unknown as RequestHandler
);

router.post(
  "/respond-request/:id",
  protectRoute,
  respondFriendRequest as unknown as RequestHandler
);

router.delete(
  "/delete-friend/:id",
  protectRoute,
  deleteFriend as unknown as RequestHandler
);

export default router;
