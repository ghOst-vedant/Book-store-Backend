import express from 'express'

import errorHandler from './middleware/errorhandler'
import userRouter from './routes/userRouter'
import bookRouter from './routes/bookRouter'

const app=express()
app.use(express.json())
// methods
app.use("/api/users",userRouter)
app.use("/api/books",bookRouter)
app.get(`/`,(req,res)=>{

    res.json({message:"Learning RESTApi."})
})

// error handler

app.use(errorHandler)
export default app
