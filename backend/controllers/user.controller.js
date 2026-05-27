import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";


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

    const profile = new Profile({userId : newUser._id})

    await profile.save();
    return res.json({message:"User Created"})

  } catch (err) {
    console.log(err);

    return res.status(500).json({
        message:"Registered Issue"
    })
  }
};

export const login = async(req,res)=>{
    try{
        //type all inpu fields
        const {email,password}= req.body

        if(!email, !password){
            return res.status(400).json({message:"All fields are required"})
        }

        //check if user has registred
        const user = await User.findOne({
            email
        });

        if(!user){
            return res.status(404).json({message:"User Does not exist"})
        }

        //Check password bcrpyt
        const isMatch = await bcrypt.comapare(password, user.password)
        if(!isMatch){
            return register.status(400).json({message:"Invalid Credentials"})
        }
        //Understand this part of token later
        const token =crypto.randomBytes(32).toString("hex")

        await User.updateOne({_id:user._id},{token});

        return res.json({token})



    }catch (err) {
    console.log(err);

    return res.status(500).json({
        message:"Registered Issue"
    })
  }
}
