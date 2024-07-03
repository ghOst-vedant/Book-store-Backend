import app from "./src/app"
import { config } from "./src/config/config"
import { dbConnection } from "./src/config/db"

const startServer = async () => {
    await dbConnection()
    const port = config.port || 3000

    app.listen(port, () => {
        console.log(`Listening on port: ${port}`)
    })
}
startServer()
