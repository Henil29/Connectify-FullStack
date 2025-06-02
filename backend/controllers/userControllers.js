import { User } from "../models/userModel.js"
import tryCatch from "../utils/tryCatch.js"
import getDataUrl from "../utils/urlGenrator.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";

export const myprofile = tryCatch(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    res.json(user);
})

export const userProfile = tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
        return res.status(404).json({
            message: 'No user with this id'
        });
    }
    res.json(user);
})

export const followAndUnfollowUser = tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({
            message: 'No user with this id'
        });
    }
    if (user._id.toString() === loggedInUser._id.toString()) {
        return res.status(400).json({
            message: 'You cannot follow yourself'
        });
    }
    if (user.followers.includes(loggedInUser._id)) {
        const indexFollowing = loggedInUser.following.indexOf(user._id);
        const indexFollower = user.followers.indexOf(loggedInUser._id);
        loggedInUser.following.splice(indexFollowing, 1);
        user.followers.splice(indexFollower, 1);
        await loggedInUser.save();
        await user.save();
        return res.json({
            message: 'User unfollowed successfully'
        });
    }
    else {
        loggedInUser.following.push(user._id);
        user.followers.push(loggedInUser._id);
        await loggedInUser.save();
        await user.save();
        return res.json({
            message: 'User followed successfully'
        });
    }
});

export const userFollowersAndFollowingData = tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id)
        .select("-password")
        .populate("followers following", "-password")

    const followers = user.followers;
    const following = user.following;


    res.json({
        followers,
        following
    })
})

export const updateProfile = tryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);

    const { name } = req.body;
    if (name) {
        user.name = name;
    }

    const file = req.file;
    if (file) {
        const fileurl = getDataUrl(file);

        await cloudinary.v2.uploader.destroy(user.profilePic.id)
        const myCloud = await cloudinary.v2.uploader.upload(fileurl.content);
        user.profilePic.id = myCloud.public_id;
        user.profilePic.url = myCloud.secure_url;
    }
    await user.save();

    res.json({
        message: 'Profile updated successfully'
    })
})

export const updatePassword = tryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);

    const { oldPassword, newPassword } = req.body;
    const comparedPassword = await bcrypt.compare(oldPassword, user.password);

    if (!comparedPassword) {
        return res.status(400).json({
            message: 'Old password is incorrect'
        });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({
        message: 'Password updated successfully'
    });
})

export const getAllUsers = tryCatch(async (req, res) => {
    const search = req.query.search || '';
    const users = await User.find({
        name: {
            $regex: search,
            $options: 'i'
        },
        _id: { $ne: req.user._id }
    }).select('-password -createdAt -updatedAt');

    res.json(users);
})