import express from 'express'
import  {registerUser,loginUser, logoutUser,registerOrganiser,loginOrganiser,logoutOrganiser,updateUserProfile,requestPasswordReset,resetPassword, requestPasswordOrganiserReset, resetPasswordOrganiser, authMe,}  from '../controllers/auth.controller.js';

 
const router=express.Router();

router.post('/user/register', registerUser)
router.post('/user/login', loginUser)
router.get('/user/logout',  logoutUser)
router.post("/user/request-password-reset", requestPasswordReset);
router.post("/user/reset-password", resetPassword);

 
router.get('/login/me', authMe)


router.post('/organiser/register', registerOrganiser)
router.post('/organiser/login', loginOrganiser)
router.get('/organiser/logout', logoutOrganiser)
router.put('/organiser/:id', updateUserProfile)
router.post("/organiser/request-password-reset", requestPasswordOrganiserReset);
router.post("/organiser/reset-password", resetPasswordOrganiser);

export default router;