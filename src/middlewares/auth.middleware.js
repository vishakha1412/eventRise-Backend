import EventOrganiser from "../models/eventorganiser.model.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

async function authEventOrganiserMiddleware(req, res, next) {
    const token=req.cookies.token; // when user logged in then only token will be there in cookies otherwise not. 

    if (!token) {
        return res.status(401).json({ message: "Please login first" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // to get id from token to work furter
        const eventOrganiser = await EventOrganiser.findById(decoded.id);
        req.eventOrganiser = eventOrganiser;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
}   

async function authUserMiddleware(req, res, next) {
    const token=req.cookies.token || req.headers.authorzation?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Please login first" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        req.user = user;
        next();
    } catch (error) {
        console.log("Auth error",error)
        return res.status(401).json({ message: "Invalid Token" });
    }
}
async function authAnyMiddleware(req,res,next){
    try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    const organiser = await EventOrganiser.findById(decoded.id);

    if (user) {
      req.user = user;
      req.role = "user";
      return next();
    }

    if (organiser) {
      req.user = organiser;
      req.role = "organiser";
      return next();
    }

    return res.status(404).json({ message: "No valid user or organiser found" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

}
export { authEventOrganiserMiddleware, authUserMiddleware ,authAnyMiddleware};    
