import EventOrganiser from "../models/eventorganiser.model.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

async function authEventOrganiserMiddleware(req, res, next) {
    const token=req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Please login first" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const eventOrganiser = await EventOrganiser.findById(decoded.id);
        req.eventOrganiser = eventOrganiser;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
}   

async function authUserMiddleware(req, res, next) {
    const token=req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Please login first" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
}
export { authEventOrganiserMiddleware, authUserMiddleware };    
