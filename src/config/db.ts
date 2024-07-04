import mongoose from "mongoose"
import { config } from "./config"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const dbConnection = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("✅ Database Connection Successfull,")
        })
        mongoose.connection.on("error", error => {
            console.log("Error Connecting Database.", error)
        })
        await mongoose.connect(config.dbUrl!)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
