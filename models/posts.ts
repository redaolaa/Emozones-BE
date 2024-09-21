import mongoose from 'mongoose';

const postSchema= new mongoose.Schema({
  name:{type: String, required: true},
  image:{type: String, required: true},
  zone: {type: String, required: true},
  user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
}, {timestamps: true})

export default mongoose.model('Post', postSchema)

