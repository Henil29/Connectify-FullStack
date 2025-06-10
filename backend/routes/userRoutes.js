import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { followAndUnfollowUser, getAllUsers, myprofile, updatePassword, updateProfile, userFollowersAndFollowingData, userProfile } from '../controllers/userControllers.js';
import uploadFile from '../middlewares/multer.js';
const router = express.Router();


router.get('/me', isAuth, myprofile)
router.get('/all', isAuth, getAllUsers)
router.post("/follow/:id", isAuth, followAndUnfollowUser);
router.get("/followdata/:id", isAuth, userFollowersAndFollowingData);
router.get('/:id', isAuth, userProfile)
router.post('/:id', isAuth, updatePassword)
router.put('/:id', isAuth, uploadFile, updateProfile)


export default router;