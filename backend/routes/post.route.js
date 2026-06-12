import { Router } from "express";
import { activeCheck, createPost } from "../controllers/post.controller.js";
import { getAllPost,deletePost } from "../controllers/post.controller.js";

const router = Router();

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename: (req,file,cb)=> {
        cb(null, file.originalname)
    },
})

const upload =multer({storage: storage})

router.route('/').post(activeCheck);

router.route("/post").post(upload.single('media'), createPost)
router.route("/posts").get(getAllPost)
router.route("/delete").post(deletePost)








export default router;