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

export const patchBook = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { bookId } = req.params
    const _req = req as authReq
    const { title, genre } = req.body
    const book = await Book.findById({ _id: bookId })
    if (!book) return res.status(404).json({ message: "Book not found" })
    if (book.author.toString() !== _req.userId)
        return res
            .status(403)
            .json({ message: "Not Authorized for modification" })

    try {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[]
        }
        let newCoverImage = ""
        if (files.coverImage) {
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
            newCoverImage = uploadResult.secure_url
            await fs.promises.unlink(filePath)
        }

        let newFile = ""
        if (files.file) {
            const bookName = files.file[0].filename
            const bookPath = path.resolve(
                __dirname,
                "../../public/data/uploads",
                bookName,
            )
            const bookUploadResult = await cloudinary.uploader.upload(
                bookPath,
                {
                    resource_type: "raw",
                    filename_override: bookName,
                    folder: "book-pdfs",
                    format: "pdf",
                },
            )
            newFile = bookUploadResult.secure_url
            await fs.promises.unlink(bookPath)
        }
        const updateBook = await Book.findOneAndUpdate(
            { _id: bookId },
            {
                title: title,
                genre: genre,
                coverImage: newCoverImage ? newCoverImage : book.coverImage,
                file: newFile ? newFile : book.file,
            },
            { new: true },
        )

        res.status(200).json(updateBook)
    } catch (error) {
        console.error(error)
    }
}
