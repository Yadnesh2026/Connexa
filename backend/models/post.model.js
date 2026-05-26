import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userID: {
    //come from user
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //Come from User Schema 
  },
  body: {
    type: String,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: String,
    default: Date.now,
  },
  media: {
    //Path where is file/media uplaoded
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: true,
  },
  fileType: {
    type: String,
    default: "",
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
