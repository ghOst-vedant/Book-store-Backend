import { config as configuration } from "dotenv"

configuration()
const _config = {
    port: process.env.PORT!,
    dbUrl: process.env.MONGO!,
    env: process.env.NODE_ENV!,
    jwtSecret: process.env.JWT_SECRET!,
    cloud_name: process.env.CLOUDINARY_NAME!,
    cloud_api: process.env.CLOUDINARY_API_KEY!,
    cloud_secret: process.env.CLOUDINARY_SECRET!,
    domain: process.env.origin!,
}

export const config = Object.freeze(_config)
