import mongoose from "mongoose"

 interface user {
    _id:string,
    name:string,
    email:string,
    password:string
}

const userSchema = new mongoose.Schema<user>({
    name:{
        type:String,
        required:true
    },
    email:{
        unique:true,
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    }

},{timestamps:true})

const User =mongoose.model<user>('user',userSchema)
export default User

