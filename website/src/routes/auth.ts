import { Router } from "express";
import * as AuthController from "../controllers/auth";

const router = Router();

router.get("/login", AuthController.loginFormHandler);
router.get("/register", AuthController.registerForm);

router.post("/login", AuthController.loginHandler);
router.post("/register", AuthController.registerHandler);

export { router as authRouter };
