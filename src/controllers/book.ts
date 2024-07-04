import { NextFunction, Request, Response } from "express"
import cloudinary from "../config/cloudinary"
import path from "path"
import Book from "../models/bookModel"
import fs from "node:fs"
import { authReq } from "../middleware/auth"
import createHttpError from "http-errors"
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
        // delete files from the server
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

    // Check if the book exist
    if (!book) return res.status(404).json({ message: "Book not found" })

    //check if the user is the author
    if (book.author.toString() !== _req.userId)
        return res
            .status(403)
            .json({ message: "Not Authorized for modification" })

    try {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[]
        }
        let newCoverImage = ""
        // if there exists any new coverImage
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
        // if there is new file in the req.files
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
export const getBooks = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const books = await Book.find()
        res.status(200).json({ books })
    } catch (error) {
        return next(createHttpError(500, "Error Fetching Books"))
    }
}

export const getBookById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { bookId } = req.params
    const book = await Book.findOne({ _id: bookId })
    //check if the book exists in the database
    if (!book) return next(createHttpError(404, "Book not found"))
    res.status(201).json({ book })
    try {
    } catch (error) {
        return next(createHttpError(500, "Unable to get book"))
    }
}

export const deleteBook = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { bookId } = req.params
    const _req = req as authReq
    const book = await Book.findOne({ _id: bookId })
    // check if the book is present in the database
    if (!book) return next(createHttpError(404, "Book not Found"))

    // see if the user is the author
    if (book.author.toString() !== _req.userId)
        return next(createHttpError(403, "Unauthorized access"))

    // calculate the publicid fromt he url of the coverImage and pdf file
    const imageSplits = book.coverImage.split("/")
    const coverImageId =
        imageSplits.at(-2) + "/" + imageSplits.at(-1)?.split(".").at(-2)

    const fileSplits = book.file.split("/")
    const fileId = fileSplits.at(-2) + "/" + fileSplits.at(-1)

    // Delete from cloudinary and mongoDB
    try {
        await cloudinary.uploader.destroy(coverImageId)
        await cloudinary.uploader.destroy(fileId, { resource_type: "raw" })
        await Book.deleteOne({ _id: bookId })
        res.status(204)
    } catch (error) {
        return next(createHttpError(500, "Error Deleting files"))
    }
}
