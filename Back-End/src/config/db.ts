import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

const connectDB = async() : Promise <void>=>{
    try {
       const mongoURI = process.env.MONGO_URI;
       if(!mongoURI){
        throw new Error('Mongodb URI is not define in .env');
       }
       await mongoose.connect(mongoURI);
       console.log('DataBase connect');
    } catch (error) {
         
        process.exit(1);
    }
};

export default connectDB;