import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import User from "../models/userModel"
import bcrypt from "bcrypt"
import { sign } from "jsonwebtoken"
import { config } from "../config/config"

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    // Processing data
    const { name, email, password } = req.body

    // 1. validation
    if (!email || !name || !password) {
        const error = createHttpError(400, "All fields are required")
        return next(error)
    }
    // 2. logical process
    try {
        const user = await User.findOne({ email })
        if (user) {
            const error = createHttpError(400, "User Already exists.")
            return next(error)
        }
        const hasedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name,
            email,
            password: hasedPassword,
        })
        await newUser.save()
        // Jwt signing
        const token = sign({ sub: newUser._id }, config.jwtSecret, {
            expiresIn: "1h",
        })
        // 3. response
        res.status(201).json({ accessToken: token })
    } catch (error) {
        return next(createHttpError(500, "Error creating user"))
    }
}
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    if (!email || !password) {
        const error = createHttpError(400, "All fields are required")
        return next(error)
    }
    try {
        const user = await User.findOne({ email })
        if (!user)
            return next(
                createHttpError(404, "User Doesnot exists.\n Register first"),
            )
        const pass = await bcrypt.compare(password, user?.password!)
        if (!pass) return next(createHttpError(400, "Incorrect Credentials"))

        const token = sign({ sub: user._id }, config.jwtSecret, {
            expiresIn: "1d",
        })
        res.json({ accessToken: token })
    } catch (error) {}
}
export { createUser, loginUser }
