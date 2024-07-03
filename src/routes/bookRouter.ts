import express from "express";
import { createBook } from "../controllers/book";

const bookRouter=express.Router()

bookRouter.post('/',createBook)
export default bookRouter