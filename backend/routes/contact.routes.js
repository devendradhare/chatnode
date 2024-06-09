import express from "express";
import { getContacts } from "./../controllers/contact.controller.js";
import protectRoute from "./../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getContacts);

export default router;
