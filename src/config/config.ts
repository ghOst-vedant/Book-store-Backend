import {config as configuration} from 'dotenv'

configuration()
const _config={
    port:process.env.PORT,
    dbUrl:process.env.MONGO
}

export const config = Object.freeze(_config)