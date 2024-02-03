import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { readFile } from 'fs';
config();

export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        
        if (!token) return res.status(400).json({status: 0, error: "No token provided"});

        const decoded = jwt.verify(token, process.env.SECRET);

        readFile('./src/json/user.json', (err, jsonString) => {
            if (err) {
                res.status(500).json({status: 0, error: "Error reading file"})
            }

            const data = JSON.parse(jsonString);
            
            if (decoded.email !== data.email) return res.status(500).json({status: 0, error: "Unauthorized to make the action"});
        })

        next();
    } catch (error) {
        return res.status(500).json({status: 0, error: "Unauthorized to make the action"});
    }
}