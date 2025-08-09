import {createLogger,format,transports,addColors} from 'winston'
import dotenv from 'dotenv'
dotenv.config()

const levels = {
    error:0,
    warn:1,
    info:2,
    http:3,
    debug:4
}

const level = ()=>{
    return process.env.NODE_ENV === "development" ? "debug" : "warn";
}

addColors({
    error:"red",
    warn:"yellow",
    info:"green",
    http:"magenta",
    debug:"blue"

})
const logger = createLogger({
  level: level(),
  levels,
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({stack:true}),
    format.splat(),
    format.colorize({all:true}),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;