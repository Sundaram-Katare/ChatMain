import express from 'express';
import { login, signup, getUserInfo, updateProfile, addProfileImage, removeProfileImage, logout } from '../controllers/AuthController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import multer from "multer";

const upload = multer({ dest: "uploads/profiles/" });

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user-info", verifyToken, getUserInfo);
router.post("/update-profile", verifyToken, updateProfile);
router.post("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImage);
router.delete("/remove-profile-image", verifyToken, removeProfileImage);

router.post("/logout", logout);
export default router;