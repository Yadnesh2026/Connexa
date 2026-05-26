import mongoose from "mongoose";

const CommentSchema = new mongoose({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    body:{
        type:String,
        required:true
    }
});

const Comment = mongoose.Model("Comment",CommentSchema);

export default Comment