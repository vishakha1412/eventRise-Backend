import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/db/db.js';

dotenv.config();
const PORT=process.env.PORT || 5000;


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});