import { compare, hash } from 'bcrypt';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

config();

export const createUser = async (req, res) => {
    const { string } = req.body;

    const hashString = await hash(string, 10);

    res.json(hashString);
}

//function to signIn in the api
export const signIn = async (req, res) => {
    const result = {
        status: 0,
        error: ""
    }
    
    const { email, password } = req.body;
    
    //verifies email and password are provided
    if (!email || !password) {
        result.error = "No email or password provided";
        res.status(400).json(result);
        return;
    }

    try{

        //verifies if the password is correct
        const match = await compare(password, process.env.HASH);

        //give back error if credentials are wrong
        if (email !== "admin@cuboplus.academy" || !match) {
            result.error = "Wrong credentials";
            res.status(400).json(result);
            return;
        }

        const token = jwt.sign({"email": "admin@cuboplus.academy"}, process.env.SECRET, {expiresIn: 84600});
        
        result.status = 1;
        result.data = {
            "token": token
        }

        res.json(result);
    } catch (err) {
        result.error = err;
        res.status(400).json(result);
    }
}