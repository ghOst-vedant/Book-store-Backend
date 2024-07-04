import { NextFunction, Request, Response } from "express"
import cloudinary from "../config/cloudinary"
import path from "path"
import Book from "../models/bookModel"
import fs from "node:fs"
import { authReq } from "../middleware/auth"
export const createBook = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { title, genre } = req.body
    const _req = req as authReq
    try {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[]
        }
        const coverImageMimeType = files.coverImage[0].mimetype
            .split("/")
            .at(-1)
        const filename = files.coverImage[0].filename
        const filePath = path.resolve(
            __dirname,
            "../../public/data/uploads",
            filename,
        )
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: filename,
            folder: "book-covers",
            format: coverImageMimeType,
        })
        const bookName = files.file[0].filename
        const bookPath = path.resolve(
            __dirname,
            "../../public/data/uploads",
            bookName,
        )
        const bookUploadResult = await cloudinary.uploader.upload(bookPath, {
            resource_type: "raw",
            filename_override: bookName,
            folder: "book-pdfs",
            format: "pdf",
        })
        console.log(bookUploadResult)
        const newBook = await Book.create({
            title,
            genre,
            author: _req.userId,
            coverImage: uploadResult.secure_url,
            file: bookUploadResult.secure_url,
        })
        await fs.promises.unlink(filePath)
        await fs.promises.unlink(bookPath)
        res.status(201).json({ id: newBook._id })
    } catch (error) {
        console.error(error)
    }
}
