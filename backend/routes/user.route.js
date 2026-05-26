import {Router} from "express"

router.route("/user",(req,res)=>{
    res.send("User Route is working")
})

export default router;