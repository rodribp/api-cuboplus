import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        
        if (!token) return res.status(400).json({status: 0, error: "No token provided"});

        const decoded = jwt.verify(token, process.env.SECRET);

        if (decoded.email !== "admin@cuboplus.academy") return res.status(400).json({status: 0, error: "Unauthorized to make the action"});

        next();
    } catch (error) {
        return res.status(400).json({status: 0, error: "Unauthorized to make the action"});
    }
}