import express from 'express'

const app=express()

// Routes
app.get(`/`,(req,res,next)=>{
    res.json({message:"Learning RESTApi."})
})

export default app
