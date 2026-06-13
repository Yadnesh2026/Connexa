import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

import PDFDocument from "pdfkit";
import fs from "fs";
// import { connection, Connection } from "mongoose";
import ConnectionRequest from "../models/connections.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comments.model.js";

const convertUserDataToPDF = (userData) => {
  const doc = new PDFDocument();

  // Generate PDF filename
  const outputPath = `uploads/${crypto.randomBytes(16).toString("hex")}.pdf`;

  const stream = fs.createWriteStream(outputPath);

  doc.pipe(stream);

  // Profile Picture
  if (userData.userId.profilePicture) {
    doc.image(`uploads/${userData.userId.profilePicture}`, {
      align: "center",
      width: 100,
    });
  }

  doc.moveDown();

  // User Information
  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`);
  doc.fontSize(14).text(`Bio: ${userData.bio}`);
  doc.fontSize(14).text(`Current Position: ${userData.currentPosition}`);

  doc.moveDown();

  // Past Work
  doc.fontSize(16).text("Past Work:");

  userData.pastWork.forEach((work, index) => {
    doc.moveDown(0.5);
    doc.fontSize(14).text(`Company Name: ${work.companyName}`);
    doc.fontSize(14).text(`Position: ${work.position}`);
    doc.fontSize(14).text(`Year: ${work.years}`);
  });

  doc.end();

  return outputPath;
};

//Register User
export const register = async (req, res) => {
  try {
    //if user not exist
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "The user is not registered" });
    }

    //for user is already registered
    const user = await User.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({ message: "The User us already Registerd" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //for new user created
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await newUser.save();

    const profile = new Profile({ userId: newUser._id });

    await profile.save();
    return res.json({ message: "User Created" });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Registered Issue",
    });
  }
};

//Login Route
export const login = async (req, res) => {
  try {
    //type all inpu fields
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //check if user has registred
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({ message: "User Does not exist" });
    }

    //Check password bcrpyt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    //Understand this part of token later
    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { token });

    return res.json({ token });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Registered Issue",
    });
  }
};

//Uploading the proile picture
export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(400).json({ message: "user not Found" });
    }

    user.profilePicture = req.file.filename;
    await user.save();

    return res.status(200).json({ message: "Profile Picture Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Update user profile for email adn username
export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUser } = req.body;

    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = newUser;
    const exisingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (exisingUser && String(exisingUser._id) !== String(user._id)) {
      return res.status(400).json({
        message: "User Already exist",
      });
    }
    //Learn  this object propertys from object mdn
    Object.assign(user, newUser);
    await user.save();

    return res.status(200).json({ message: "User updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//update bio and all data
export const get_user_and_profile = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture",
    );

    return res.json(userProfile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//update the profile picture
export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newUser } = req.body;

    const userProfile = await User.findOne({ token: token });

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile_to_update = await Profile.findOne({
      userId: userProfile._id,
    });
    Object.assign(profile_to_update, newUser); //Object assign operator

    await profile_to_update.save();
    res.status(200).json({ message: "Profile Updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Get all User profile - Serach bar
export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture",
    );

    return res.json({ profiles });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Download the resume
export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;

    const userProfile = await Profile.findOne({
      userId: user_id,
    }).populate("userId", "name username email profilePicture");

    const outputPath = convertUserDataToPDF(userProfile);

    return res.json({ outputPath });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

//Sendd request how to send connection
export const sendConnecionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const connectionUser = await User.findOne({ _id: connectionId });

    if (!connectionUser) {
      return res.status(404).json({ message: "Connecion User not found" });
    }

    //If the user is existting
    const exisitngRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (exisitngRequest) {
      return res.status(400).json({ message: "reqquest already sent " });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getMyConnectionRequest = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    //request already send if they have sendd already request
    const connections = await ConnectionRequest.find({ userId: user._id })
      .populate;
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const commentPost = async (req, res) => {
  const { token, post_id, commentBody } = req.body;
  const user = await User.findOne({ token: token });

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({
      _id: post_id,
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = new Comment({
      userId: user._id,
      postId: post_id,
      comment: commentBody,
    });

    await comment.save();

    return res.status(200).json({ message: "Comment Added" });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};


