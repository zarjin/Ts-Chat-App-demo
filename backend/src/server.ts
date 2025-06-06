import cookieParser from "cookie-parser"
import cors from "cors"
import "dotenv/config"
import express from "express"

import { connectDB } from "./configs/connectdb.config"

const app= express()

connectDB()

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/", (req, res)=>{
  res.send("Hello World")
})

const PORT = process.env.PORT

app.listen(PORT, ()=>{
  console.log(`server is running http://localhost:${PORT}`)
})

