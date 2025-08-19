import { RequestHandler, Router } from "express";
import {
  changePassword,
  deleteAccount,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import { validate } from "../middleware/validate.js";
import {
  signupSchema,
  loginSchema,
  changePasswordSchema,
  updateProfileSchema,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/signup", validate({ body: signupSchema }), signup);
router.post("/login", validate({ body: loginSchema }), login);

router.post("/logout", protectRoute, logout);
router.post(
  "/change-password",
  protectRoute,
  validate({ body: changePasswordSchema }),
  changePassword,
);
router.delete("/delete-account", protectRoute, deleteAccount);
router.put(
  "/update-profile",
  protectRoute,
  validate({ body: updateProfileSchema }),
  updateProfile,
);

export default router;
