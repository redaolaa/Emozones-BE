import Posts from "../models/posts";
import { Request, Response } from "express";
import formatValidationError from "../errors/validation";

export const updatePost = async (req: Request, res: Response) => {
  try {
    // ! 1) Get the post
    const postId = req.params.postId;
    const update = req.body;
    // ! 2) Update the post
    const updatedPost = await Posts.findByIdAndUpdate(postId, update, {
      new: true,
    }); // ? The final argument returns the updated post.
    // ! 3) Send back the post you've updated
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
  // ! in order to create a movie, the schema requires a "user" field
  // ! and thus we must pull that out of the req.currentUser variable (which
  // !    is populated by the jwt validation code)
  req.body.user = req.currentUser._id;
  try {
    const post = await Posts.create(req.body);
    console.log("post succefully created:", post)

    // we have the ids of the actors in the movie. We need to add the movie id to the actors
    // ['3454fefer3r', '3243ruroywedqs']

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
  // * The try part contains the code that can throw an error.
  try {
    // ! 1) Get the id I need to GET my post
    const postId = req.params.postId;
    // ! 2) Find my movie
    const foundPost = await Posts.findById(postId) // ? The populate method is used to get the actors' data.
    // const foundPost = await Posts.findById(postId).populate("actors");

    console.log(foundPost);
    // const foundPost = await Posts.findOne({ _id: postId }) // ? Alternative method.
    // ! 3) Send back the movie you found!
    res.send(foundPost);

    // * The catch part "catches" the error that was "thrown". We can handle it in here.
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
