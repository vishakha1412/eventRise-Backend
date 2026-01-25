import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authroutes from './routes/auth.routes.js'
import eventroutes from'./routes/event.routes.js'
import organiserroutes from './routes/eventOrganiser.js'
import feedbackroutes from './routes/Feedback.routes.js'
 
// comments are for understanding what the use of code of line  
 
 

const app=express();
app.use(cors( // to prevent cors error 
    {
        origin:"https://eventrise-six.vercel.app",
        credentials:true,
    }
));
app.use(cookieParser());  // to parse cookies from incoming requests

app.use(express.json()); // to parse json data from incoming requests

app.get('/',(req,res)=>{
    res.send("Welcome to EventRise Backend");
});

app.use('/api/auth',authroutes);
app.use('/api/event',eventroutes)
app.use('/api/organiser',organiserroutes)
app.use('/api/feedback', feedbackroutes); // Dynamic import for Feedback routes



export default app;
