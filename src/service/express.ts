

import express, { Express } from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";
import mongoose, { ConnectOptions } from "mongoose";
import router from "@/router/index";
import config from "@/config/index";
import errorMiddleware from "@/middleware/error-middleware";
import { UserToken } from "@/models/token-model";


declare global {
    namespace Express {
        interface Request {
            user?: UserToken;
        }
    }
}

const PORT: string | number = config.PORT ?? 5000
const app: Express = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: config.CLIENT_URL

}))
app.use('/api', router)
app.use(errorMiddleware)

const start: Function = async (): Promise<void> => {
    try {
        await mongoose.connect(config.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions)
        app.listen(PORT, () => console.log(`server listen on ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

export default start