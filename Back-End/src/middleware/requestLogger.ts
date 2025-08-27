import morgan ,{StreamOptions}from 'morgan';
import logger from '../utils/logger';
import dotenv from 'dotenv';
dotenv.config();

const stream:StreamOptions = {
    write : (message)=>logger.http(message.trim()),
};


const skip = ()=>{
    return process.env.NODE_ENV  === 'test';
};

const requestLogger = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

export default requestLogger;


