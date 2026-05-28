import { Router } from "express";
import {
  login,
  register,
  uploadProfilePicture,
} from "../controllers/user.controller.js";
import multer from "multer"; //Used to file upload from frontend to backend

const router = Router();

//Store the Image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route("/upload_profile") //Path to where file is gonna store
  .post(upload.single("profile"), uploadProfilePicture);//Take one uploaded file whose field name is profile

router.route("/register").post(register);
router.route("/login").post(login);

export default router;
