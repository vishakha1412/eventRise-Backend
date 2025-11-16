import express from 'express'
import  {registerUser,loginUser, logoutUser,registerOrganiser,loginOrganiser,logoutOrganiser}  from '../controllers/auth.controller.js';

 
const router=express.Router();

 router.post('/user/register', registerUser)
 router.post('/user/login', loginUser)
router.get('/user/logout',  logoutUser)



router.post('/organiser/register', registerOrganiser)
router.post('/organiser/login', loginOrganiser)
router.get('/organiser/logout', logoutOrganiser)

export default router;