import express from 'express';
import { getUserById } from '../controllers/user.controller.js';
import { authUserMiddleware } from '../middlewares/auth.middleware.js';

const router=express.Router();

router.get('/:id',
    authUserMiddleware,
     getUserById )

export default router;