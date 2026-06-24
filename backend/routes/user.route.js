import { Router } from "express";
import {
  login,
  register,
  uploadProfilePicture,
  updateUserProfile,
  get_user_and_profile,
  updateProfileData,
  getAllUserProfile,
  downloadProfile,
  sendConnecionRequest,
  getMyConnectionRequest,
  whatAreMyConnections,
  acceptConnectionRequest,
  getUserProfileAndUserBasedOnUsername
} from "../controllers/user.controller.js";
import multer from "multer"; //Used to file upload from frontend to backend
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads");

//Store the Image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }

    cb(null, true);
  },
});

router.route("/upload_profile") //Path to where file is gonna store
  .post(upload.single("profile"), uploadProfilePicture);//Take one uploaded file whose field name is profile

//After this Multer above step then file became (req.file) - stores here 

// Frontend File
//       ↓
// upload.single("profile")
//       ↓
// Multer stores image
//       ↓
// req.file created
//       ↓
// uploadProfilePicture controller



router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUserProfile)
router.route("/get_user_and_profile").post(get_user_and_profile)
router.route("/update_profile_data").post(updateProfileData)

router.route("/user/getAllUserProfile").get(getAllUserProfile)

router.route("/user/download_resume").get(downloadProfile)
router.route("/user/send_connection_request").post(sendConnecionRequest)
router.route("/user/getConnectionRequests").get(getMyConnectionRequest);

router.route("/user/user_connection_request").post(whatAreMyConnections)
router.route("/user/accept_connection_request").post(acceptConnectionRequest)
router.route("/user/getUserProfileAndUserBasedOnUsername").get(getUserProfileAndUserBasedOnUsername)






export default router;
