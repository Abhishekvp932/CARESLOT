import mongoose from 'mongoose';

import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const connectDB = async() : Promise <void>=>{
    try {
       const mongoURI = process.env.MONGO_URI;
       if(!mongoURI){
        throw new Error('Mongodb URI is not define in .env');
       }
       await mongoose.connect(mongoURI,{autoIndex:true});
      
       console.log('DataBase connect');
    } catch (error) {
         logger.error(error);
        process.exit(1);
    }
};

export default connectDB;