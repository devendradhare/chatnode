import express from "express";
import protectRoute from "./../middleware/protectRoute.js";
import {
  logout,
  login,
  signup,
  update,
} from "./../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/update", protectRoute, update);

export default router;
