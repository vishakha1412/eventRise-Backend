import express from "express";
import { createEvent, getEvent,likeevent,saveEvent,deleteEvent,getSaveEvent,savedEvent,  getLikedEvent } from "../controllers/event.controller.js";
import { authAnyMiddleware, authEventOrganiserMiddleware,authUserMiddleware } from "../middlewares/auth.middleware.js";
import multer from "multer";
const router=express.Router();

const upload=multer({
    storage:multer.memoryStorage(),
})
 
export const uploadImages = upload.array("images", 5);

 
export const uploadVideo = upload.single("video");

//router.post('/',authEventOrganiserMiddleware,upload.single("file"),createEvent)// here name you give inside upload single should be sme in front end
router.post('/',authEventOrganiserMiddleware,uploadImages,createEvent)

 router.delete('/:id',authEventOrganiserMiddleware,
    deleteEvent
)



router.get('/',authAnyMiddleware,getEvent)
/*
router.post('/like',authUserMiddleware,likeevent)
router.post('/save',authUserMiddleware,saveEvent)
router.get('/saved',authUserMiddleware,
   getSaveEvent
)
router.get('/saved/:eventId',authUserMiddleware,savedEvent)
router.get('/getLike/:eventId',authUserMiddleware,getLikedEvent)*/
router.post('/like',authAnyMiddleware,likeevent);
router.post('/save',authAnyMiddleware,saveEvent);
router.get('/saved',authAnyMiddleware,getSaveEvent);
router.get('/saved/:eventId',authAnyMiddleware,savedEvent)
router.get('/getLike/:eventId',authAnyMiddleware,getLikedEvent)
export default router;
