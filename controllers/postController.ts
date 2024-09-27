import Posts from "../models/posts";
import { Request, Response } from "express";
import formatValidationError from "../errors/validation";

export const updatePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const update = req.body;
    const updatedPost = await Posts.findByIdAndUpdate(postId, update, {
      new: true,
    }); // ? The final argument returns the updated post.
    res.send(updatedPost);
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    console.log("delete request from user", req.currentUser);
if (!req.currentUser) {
  console.log(" no user found in request. Deletion request is unauthorised")
  return res.status(401). json({message:"unauthorised. User not found"})
}


    const postId = req.params.postId;
    console.log("post id to be deleted:", postId)

    const postDoc = await Posts.findById(postId);
    if (!postDoc){
      console.log(" post not found for id:", postId)
      return res.status(404).json({message: "The Post you're trying to delete is not found"
      });
    }

    const postOwnerID = postDoc.user;
    console.log("the post you're trying to delete is owned by", postOwnerID);

    if (req.currentUser._id.equals(postOwnerID)) {
      console.log("user is the owner, proceeding with deletion...")
      const deletedPost = await Posts.findByIdAndDelete(postId);
      res.send(deletedPost);
    } else {
      console.log("  user is not the owner, deletion not allowed")
      res.status(403).json({ message: "Sorry, it is not very nice to delete other people's posts.",
      });
    }
  } catch (error) {
    console.log("Error occured during deletion:", error)
    return res.status(400).send(error);
  }
};

export const createPost = async (req: Request, res: Response) => {
  console.log(
    "this CREATE REQUEST is coming from this person: ",
    req.currentUser
  );
console.log("creating post- incoming request body:", req.body)
console.log("creating post- current user", req.currentUser)

  req.body.user = req.currentUser._id; 
  try {
    const post = await Posts.create(req.body);
    console.log("post succefully created:", post)


    res.send(post);
  } catch (error) {
    console.log(" error creating post:", error)
    res.status(400).json({
      message: "could not create post",
      errors: formatValidationError(error),
    });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const foundPost = await Posts.findById(postId) // ? The populate method is used to get more data if created like reviews or actor

    console.log(foundPost);
    // const foundPost = await Posts.findOne({ _id: postId }) // ? Alternative method.
    res.send(foundPost);

  } catch (e) {
    console.log(e);
    res.send({ message: "Post not found. Did you provide a valid postId?" });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Posts.find();
    res.send(posts);
  } catch (error) {
    return res.status(400).send(error);
  }
};
