import mongoose from "mongoose";
import Users from '../models/users'
import Posts from '../models/posts'

const adminUser= {
    "username" : "ola",
    "email" : "ola@ola.com",
    "password": "Password1!"
}

async function seed () {
    await mongoose.connect('mongodb://127.0.0.1:27017/emozonesdb')
    console.log('Connected to the database!!🔥')

    const user = await Users.create(adminUser)
    
// creating a post
    const postData = {name:'bubbles', user: user, image: "http://", zone: 'blue'}
const post= await Posts.create(postData) 

console.log ('Here are the posts:')
console.log(post)

console.log ('Disconnecting...')
await mongoose.disconnect()
}
seed ()