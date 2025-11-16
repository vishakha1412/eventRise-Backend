import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authroutes from './routes/auth.routes.js'
import eventroutes from'./routes/event.routes.js'
import organiserroutes from './routes/eventOrganiser.js'
 
 
 
 

const app=express();
app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true,
    }
));
app.use(cookieParser());

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Welcome to EventRise Backend");
});

app.use('/api/auth',authroutes);
app.use('/api/event',eventroutes)
app.use('/api/organiser',organiserroutes)




export default app;