import express from "express";
import { createEvent, getEvent,likeevent,saveEvent,deleteEvent } from "../controllers/event.controller.js";
import { authEventOrganiserMiddleware,authUserMiddleware } from "../middlewares/auth.middleware.js";
import multer from "multer";
const router=express.Router();

const upload=multer({
    storage:multer.memoryStorage(),
})
router.post('/',authEventOrganiserMiddleware,upload.single("file"),createEvent)// here name you give inside upload single should be sme in front end
// if i use upload.single then only one file can be uploaded at a time
// if i use upload.array then multiple files can be uploaded at a time
 router.delete('/:id',authEventOrganiserMiddleware,
    deleteEvent
)



router.get('/',authUserMiddleware,getEvent)
export default router;



router.post('/like',authUserMiddleware,
     likeevent
)
router.post('/save',authUserMiddleware,saveEvent)