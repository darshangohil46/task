import { Router } from "express";
import * as c from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router = Router();
router.post("/signup", c.signup);
router.post("/login", c.login);
router.get("/me", authMiddleware, c.me);
export default router;
