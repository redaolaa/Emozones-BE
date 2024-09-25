import express from 'express'
import {signup, login, getCurrentUser} from "../controllers/userController"
import {createPost, deletePost, getPosts, getPostById, updatePost} from "../controllers/postController"
import secureRoute from '../middleware/secureRoute';

const router= express.Router();
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/posts").get(getPosts).post(secureRoute, createPost);

router.route("/posts/:postId").get(getPostById).delete(secureRoute, deletePost).put(secureRoute, updatePost);

router.route("/user").get(secureRoute, getCurrentUser)

export default router