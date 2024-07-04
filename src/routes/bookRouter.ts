import express from "express"
import { createBook } from "../controllers/book"
import multer from "multer"
import path from "node:path"
import auth from "../middleware/auth"

const bookRouter = express.Router()
const upload = multer({
    dest: path.resolve(__dirname, "../../public/data/uploads"),
    // 30mb
    limits: { fileSize: 1e7 },
})
bookRouter.post(
    "/",
    auth,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    createBook,
)

export default bookRouter
