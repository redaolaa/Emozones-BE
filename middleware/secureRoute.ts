import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import Users from '../models/users'

export default function secureRoute(req: Request, res: Response, next: NextFunction) {
    const rawToken = req.headers.authorization
    console.log("incoming authorisation header:", rawToken)
    if (!rawToken) {
        console.log("no auth header found")
        return res.status(401).json({ message: "Unauthorized. No Auth header found" })
    }

    const token = rawToken.replace("Bearer ", "")
    console.log("extracted token:", token)

    

    jwt.verify(token, (process.env.SECRET || "developmentSecret"), async (err, payload) => {
        if (err || !payload) {
            console.log("JWT verification error:", err)
            console.log("using secret:", process.env.SECRET || "developmentSecret")
            return res.status(401).json({ message: "Unauthorized. Invalid JWT." })
        }
        console.log("Valid token! The payload is:", payload); 
    

        interface JWTPayload {
            userId: string
        }

        const jwtPayload = payload as JWTPayload
        const userId = jwtPayload.userId
        console.log("extracted UserId from the payload:", userId)


if (!userId) {
    console.log(" no userId found in JWT payload")
    return res.status(401).json({message: "Unauthorised. Invalid JWT payload"})
}


        const user = await Users.findById(userId)
        if (!user) {
            console.log("user not found for ID:", userId)
            return res.status(401).json({ message: "User not found. Invalid JWT!" })
        }


        req.currentUser = user;
        console.log("Current user set in request:", req.currentUser)

        next() // the request moves on to the next middleware in the chain
    })
}