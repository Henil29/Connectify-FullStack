import { User } from "../models/userModel.js";
import getDataUrl from "../utils/urlGenrator.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import tryCatch from "../utils/tryCatch.js";

export const registerUser = tryCatch(async (req, res) => {
    const { name, email, password, gender } = req.body;

    const file = req.file;
    if (!name || !email || !password || !gender || !file) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    let user = await User.findOne({ email })

    if (user) {
        return res.status(400).json({
            message: "User already exists"
        });
    }
    const fileUrl = getDataUrl(file);

    const hashPassword = await bcrypt.hash(password, 10);

    const myClode = await cloudinary.v2.uploader.upload(fileUrl.content)

    user = await User.create({
        name,
        email,
        password: hashPassword,
        gender,
        profilePic: {
            id: myClode.public_id,
            url: myClode.secure_url
        }
    });
    generateToken(user._id, res);

    res.status(201).json({
        message: "User registered successfully",
        user,
    })
})

export const loginUser = tryCatch(async (req, res) => {
    const {email, password} = req.body;

    const user= await User.findOne({ email })
    if (!user) {
        return res.status(400).json({
            message: "User not found"
        });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        return res.status(400).json({
            message: "Invalid password"
        });
    }
    generateToken(user._id, res);
    res.json({
        message: "User logged in successfully",
        user
    });
})

export const logoutUser = tryCatch(async (req, res) => {
    res.cookie("token", "", {
        maxAge: 0,
    });

    res.status(200).json({
        message: "User logged out successfully"
    });
})