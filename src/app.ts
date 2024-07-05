import express, { Request, Response } from "express"

import errorHandler from "./middleware/errorhandler"
import userRouter from "./routes/userRouter"
import bookRouter from "./routes/bookRouter"
import cors from "cors"
import { config } from "./config/config"
const app = express()

app.use(express.json())
app.use(
    cors({
        origin: config.domain,
    }),
)
// methods
app.use("/api/users", userRouter)
app.use("/api/books", bookRouter)
app.get(`/`, (req: Request, res: Response) => {
    res.json({ message: "Learning RESTApi." })
})

// error handler

app.use(errorHandler)
export default app
