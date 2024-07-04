import mongoose from "mongoose"
import book from "../Types/bookTypes"

const bookSchema = new mongoose.Schema<book>(
    {
        title: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        coverImage: {
            type: String,
            required: true,
        },
        genre: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
)

const Book = mongoose.model<book>("book", bookSchema)
export default Book
