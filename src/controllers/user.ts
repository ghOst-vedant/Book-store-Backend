import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createUser=async(req:Request,res:Response, next:NextFunction)=>{
    // Processing data
    const {name,email,password}=req.body
    
    // 1. validation
    if(!email || !name ||!password) {
        const error=createHttpError(400,"All fields are required")
        return next(error)

    }
    // 2. logical process
    // 3. response
    res.json({message:"Registed Successfully"})
}

export {createUser}