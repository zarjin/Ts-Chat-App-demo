import mongoose from "mongoose";

export const connectDB = async () =>{
  try {
    await mongoose.connect(process.env.MONOGO_URI as string)
    console.log("mongodb connected")
  } catch (error) {
    console.log(`monodb-connect-error:${error}`)
  }
}