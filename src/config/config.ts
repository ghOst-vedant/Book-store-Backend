import {config as configuration} from 'dotenv'

configuration()
const _config={
    port:process.env.PORT!,
    dbUrl:process.env.MONGO!,
    env:process.env.NODE_ENV!
}

export const config = Object.freeze(_config)