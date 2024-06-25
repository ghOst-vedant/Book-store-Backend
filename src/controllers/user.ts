import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import User from "../models/userModel";
import bcrypt, { genSalt } from "bcrypt"
import { sign } from "jsonwebtoken";
import { config } from "../config/config";


const createUser=async(req:Request,res:Response, next:NextFunction)=>{
    // Processing data
    const {name,email,password}=req.body
    
    // 1. validation
    if(!email || !name ||!password) {
        const error=createHttpError(400,"All fields are required")
        return next(error)
    }
    // 2. logical process
        const user = await User.findOne({email})
        if(user) {
            const error=createHttpError(400,"User Already exists.")
            return next(error)
        }
        const hasedPassword=await bcrypt.hash(password,10)
        const newUser=await User.create({
            name,
            email,
            password:hasedPassword
        })
        await newUser.save()

        const token =sign({sub:newUser._id},config.jwtSecret,{expiresIn:'1h'})

    // 3. response
    res.json({accessToken: token})
}

export {createUser}