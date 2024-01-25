import { Router } from "express";
import { createUser, signIn } from "../controllers/auth.controller";
const router = Router();

router.post('/signin', signIn);
router.post('/signup', createUser);

export default router;