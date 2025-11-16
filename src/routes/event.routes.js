import express from "express";
import { createEvent, getEvent } from "../controllers/event.controller.js";
import { authEventOrganiserMiddleware,authUserMiddleware } from "../middlewares/auth.middleware.js";
import multer from "multer";
const router=express.Router();

const upload=multer({
    storage:multer.memoryStorage(),
})
router.post('/',authEventOrganiserMiddleware,upload.single("file"),createEvent)// here name you give inside upload single should be sme in front end
 



router.get('/',authUserMiddleware,getEvent)
export default router;