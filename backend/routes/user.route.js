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
  acceptConnectionRequest
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
router.route("/update_profile_data").post(updateProfileData);

router.route("/user/getAllUserProfile").get(getAllUserProfile)
router.route("/user/download_resume").get(downloadProfile)
router.route("/user/send_connecction_request").get(sendConnecionRequest)
router.route("/user/getConnectionRequests").get(getMyConnectionRequest);

router.route("/user/user_connection_request").post(whatAreMyConnections)
router.route("/user/accept_connection_request").post(acceptConnectionRequest)



export default router;
