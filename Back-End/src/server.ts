import express ,{Application,Request,Response}from 'express'
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport'
import cookieParser from 'cookie-parser'
import autRoutes from './routes/auth.route';
import connectDB from './config/db';
import { confiqurePassport } from './config/passport';
import doctorRoute from './routes/doctor.route'
dotenv.config()
const app : Application = express()

const corsOperation = {
    origin: "http://localhost:2025", 
    credentials:true
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || '3fedfee11c19bbcc6df09c4b', 
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);
app.use(cookieParser())
app.use(cors(corsOperation))
app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({extended:true,limit:"10mb"}))
app.use(passport.initialize())
app.use(passport.session());
confiqurePassport()
app.use('/api/auth',autRoutes)
app.use('/api/doctor',doctorRoute);
connectDB()
const PORT = process.env.PORT 
app.listen(PORT,()=>{
    console.log(`server ${PORT} is running`)
})