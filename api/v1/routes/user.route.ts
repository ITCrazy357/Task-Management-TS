import express from "express";
import { Router } from "express";
const router: Router = express.Router();
import * as authMiddleware from "../middlewares/auth.middleware";

//Controller
import * as controller from "../controllers/user.controller";

router.post("/register", controller.register);

router.post("/login", controller.login);

router.get("/detail", authMiddleware.requireAuth, controller.detail);

export const userRoutes: Router = router;
