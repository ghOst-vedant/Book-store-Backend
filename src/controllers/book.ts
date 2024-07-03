import { NextFunction, Request, Response } from "express"
import cloudinary from "../config/cloudinary"
import path from "path"

export const createBook = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1)
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
    console.log(uploadResult)

    res.json({})
}
