import express from "express";
import { Router } from "express";
const router: Router = express.Router();

//Controller
const controller = require("../controllers/user.controller");

router.post("/register", controller.register);

router.post("/login", controller.login);

export const userRoutes: Router = router;
