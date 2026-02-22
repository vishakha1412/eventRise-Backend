import express from 'express';
import { authEventOrganiserMiddleware, authUserMiddleware } from '../middlewares/auth.middleware.js';
import { getOrganiserById } from '../controllers/organiser.controller.js';
const router=express.Router();
//  /api/EventOrganiser/:id
router.get("/:id",
    authEventOrganiserMiddleware,
    getOrganiserById
)
export default router