import { Router } from "express";
import { createUser, signIn, verifyUserExist, verifyJwt } from "../controllers/auth.controller";
const router = Router();

router.get('/verify/:jwt', verifyJwt);
router.get('/firstUser', verifyUserExist);
router.post('/signin', signIn);
router.post('/signup', createUser);

export default router;