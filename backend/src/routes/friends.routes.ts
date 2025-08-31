import express, { RequestHandler, Router } from "express";
import { protectRoute, validate } from "@/middleware";
import {
  deleteFriend,
  getFriendRequests,
  getFriends,
  respondFriendRequest,
  sendFriendRequest,
} from "@/controllers";
import {
  deleteFriendParamsSchema,
  respondFriendRequestBodySchema,
  respondFriendRequestParamsSchema,
  sendFriendRequestParamsSchema,
} from "../validators/friend.validation.js";

const router: Router = express.Router();

router.get("/", protectRoute, getFriends as unknown as RequestHandler);

router.get("/requests", protectRoute, getFriendRequests);

router.post(
  "/send-request/:id",
  protectRoute,
  validate({ params: sendFriendRequestParamsSchema }),
  sendFriendRequest as unknown as RequestHandler,
);

router.post(
  "/respond-request/:id",
  protectRoute,
  validate({
    params: respondFriendRequestParamsSchema,
    body: respondFriendRequestBodySchema,
  }),

  respondFriendRequest as unknown as RequestHandler,
);

router.delete(
  "/delete-friend/:id",
  protectRoute,
  validate({ params: deleteFriendParamsSchema }),
  deleteFriend as unknown as RequestHandler,
);

export default router;
