import { Router } from "express";
import { activeCheck } from "../controllers/post.controller.js";

const router = Router();

router.route('/').post(activeCheck);


export default router;