import tryCatch from "../utils/tryCatch.js"
import getDataUrl from "../utils/urlGenrator.js";
import cloudinary from "cloudinary";
import { Post } from "../models/postModel.js";

export const newPost = tryCatch(async (req, res) => {
    const { caption } = req.body;

    const ownerId = req.user._id;

    const file = req.file;
    const fileUrl = getDataUrl(file);

    let option;

    const type = req.query.type;
    if (type == "reel") {
        option = {
            resource_type: "video",
        }
    }
    else {
        option = {}
    }
    const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content, option);
    const post = await Post.create({
        caption,
        post: {
            id: myCloud.public_id,
            url: myCloud.secure_url,
        },
        owner: ownerId,
        type,
    });

    res.status(201).json({
        message: "Post created successfully",
        post,
    });
})

export const deletePost = tryCatch(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }
    if (post.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            message: "You are not authorized to delete this post"
        });
    }
    await cloudinary.v2.uploader.destroy(post.post.id);
    await post.deleteOne();
    res.status(200).json({
        message: "Post deleted successfully"
    });
})
export const getAllPosts = tryCatch(async (req, res) => {
    // const posts = await Post.find({type: "post"}).sort({createdAt: -1}).populate("owner", "name profilePic");
    const posts = await Post.find({ type: "post" }).sort({ createdAt: -1 }).populate("owner", "-email -password -createdAt -updatedAt -__v")
        .populate({
            path: "comments.user",
            select: "-password"
        });

    const reels = await Post.find({ type: "reel" }).sort({ createdAt: -1 }).populate("owner", "-email -password -createdAt -updatedAt -__v")
        .populate({
            path: "comments.user",
            select: "-password"
        });

    res.status(200).json({
        message: "Posts fetched successfully",
        posts, reels
    });
})

export const likeUnlikePost = tryCatch(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    let status;
    if (post.likes.includes(req.user._id)) {
        const index = post.likes.indexOf(req.user._id);
        post.likes.splice(index, 1);
        status = "unliked";
    } else {
        post.likes.push(req.user._id);
        status = "liked";
    }
    await post.save();
    res.status(200).json({
        message: `Post ${status} successfully`,
        likes: post.likes.length
    });
})

export const commentOnPost = tryCatch(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
        user: req.user._id,
        name: req.user.name,
        comment: req.body.comment,
    });

    await post.save();

    const updatedPost = await Post.findById(req.params.id).populate({
        path: "comments.user",
        select: "name profilePic"
    });

    res.status(200).json({
        message: "Comment added successfully",
    });
});


export const deleteComment = tryCatch(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    if (!req.body.commentId) {
        return res.status(400).json({
            message: "Comment ID is required"
        });
    }

    const commentIndex = post.comments.findIndex(
        (item) => item._id.toString() === req.body.commentId.toString()
    )
    if (commentIndex === -1) {
        return res.status(404).json({
            message: "Comment not found"
        });
    }
    const comment = post.comments[commentIndex];
    if (post.owner.toString() === req.user._id.toString() || comment.user.toString() === req.user._id.toString()) {
        post.comments.splice(commentIndex, 1);
        await post.save();
        return res.status(200).json({
            message: "Comment deleted successfully",
            comments: post.comments,
        });
    }
    else {
        return res.status(403).json({
            message: "You are not authorized to delete this comment"
        });
    }

})

export const editCaption = tryCatch(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            message: "You are not authorized to edit this post"
        });
    }

    post.caption = req.body.caption;
    await post.save();

    res.status(200).json({
        message: "Caption updated successfully",
        post,
    });
})