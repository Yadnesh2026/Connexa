import { Router } from "express";
import { login, register } from "../controllers/user.controller.js";
import multer from 'multer' //Used to file upload from frontend to backend

const router = Router();

//Store the Image 
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'/uploads')
    },
    filname:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload = multer({storage: storage})

router.route("/upload_profile").post(upload.single('profile'),uploadProfilePicture)


router.route("/register").post(register);
router.route("/login").post(login)

export default router;
