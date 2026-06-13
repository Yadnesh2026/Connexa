import { Router } from "express";
import { activeCheck, createPost, delete_comment_of_user, get_comment_by_post, increment_likes } from "../controllers/post.controller.js";
import { getAllPost,deletePost } from "../controllers/post.controller.js";
import { commentPost } from "../controllers/user.controller.js";

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
router.route("/commment").post(commentPost)
router.route("/get_comments").get(get_comment_by_post);
router.route("/delete_comment").delete(delete_comment_of_user)
router.route("/increment_post_likes").post(increment_likes)








export default router;