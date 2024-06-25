import express from 'express'

import errorHandler from './middleware/errorhandler'
import userRouter from './routes/userRouter'

const app=express()

// methods
app.use("/api/users",userRouter)
app.get(`/`,(req,res)=>{

    res.json({message:"Learning RESTApi."})
})

// error handler

app.use(errorHandler)
export default app
