import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import router from "./router/index.js";
import config from "./config/index.js";
import errorMiddleware from "./middleware/error-middleware.js";



const PORT = config.PORT ?? 5000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: config.CLIENT_URL

}))
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
    try {
        await mongoose.connect(config.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`server listen on ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()