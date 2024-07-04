import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import { Jwt, verify } from "jsonwebtoken"
import { config } from "../config/config"

export interface authReq extends Request {
    userId: string
}
const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")
    if (!token)
        return next(createHttpError(401, "Authorization token required"))
    try {
        const parsedToken = token.split(" ")[1]
        const verifiedToken = verify(parsedToken, config.jwtSecret)
        const _req = req as authReq
        _req.userId! = verifiedToken.sub as string
        next()
    } catch (error) {
        console.error("Token Expired: ", error)
    }
}

export default auth
