import mongoose from "mongoose";
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import router from "../../config/router"
import serverless from "serverless-http"

const app = express();
app.use(cors())

app.use(express.json()); 
app.use('/api', router)

const dbURI : any = process.env.DB_URI
async function start() {
    const mongoUrl = process.env.MONGO_DB_URL as string
    await mongoose.connect(dbURI);
    console.log("connected to the database!!!");

    // app.listen(process.env.PORT, () => {
    //     console.log(`Express API is running on http://localhost:${process.env.PORT}`)
    // })

}
start();
export const handler = serverless(app)