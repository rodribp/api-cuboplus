import { compare, hash } from 'bcryptjs'
import { config } from 'dotenv';
import { readFile, writeFile } from 'fs';
import jwt from 'jsonwebtoken';

config();

export const verifyUserExist = async (req, res) => {
    const result = {
        status: 0,
        error: ""
    }
    readFile('./src/json/user.json', (err, jsonString) => {
        	if (err) {
                result.error = "Error reading file";
                res.status(400).json(result);
                return;
            }

            const data = JSON.parse(jsonString);

            if (!data.email || !data.password) {
                result.error = "There's no user signed up yet";
                result.verify = 1;
                res.json(result);
                return;
            }

            result.status = 1;
            result.verify = 1;
            res.json(result);
    });
}


export const verifyJwt = async (req, res) => {
    try {
        const token = req.params.jwt;
        
        if (!token) return res.status(400).json({status: 0, error: "No token provided"});

        const decoded = jwt.verify(token, process.env.SECRET);

        readFile('./src/json/user.json', (err, jsonString) => {
            if (err) {
                res.status(500).json({status: 0, error: "Error reading file"})
            }

            const data = JSON.parse(jsonString);
            
            if (decoded.email !== data.email) return res.status(500).json({status: 0, error: "Unauthorized to make the action"});
        })

        res.json({status: 1});
    } catch (error) {
        return res.status(500).json({status: 0, error: "Unauthorized to make the action"});
    }
}

const isSecurePassword = (password) => {
    // 8 characters minimum
    const minLength = 8;
  
    // At least a single upper case letter
    const hasUpperCase = /[A-Z]/.test(password);
  
    // At least a single lower case letter
    const hasLowerCase = /[a-z]/.test(password);
  
    // At least a number
    const hasNumber = /\d/.test(password);
  
    // at least a single special character
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
  
    // Minimum length
    const hasMinLength = password.length >= minLength;

    const messages = {
        minLength: `The password must contain ${minLength} characters.`,
        upperCase: "The password must contain upper case letters.",
        lowerCase: "The password must contain lower case letters.",
        number: "The password must contain numbers.",
        specialChar: "The password must contain special characters.",
    };
    
    // Verifies and return messages
    if (!hasMinLength) return {status: 0, message: messages.minLength};
    if (!hasUpperCase) return {status: 0, message: messages.upperCase};
    if (!hasLowerCase) return {status: 0, message: messages.lowerCase};
    if (!hasNumber) return {status: 0, message: messages.number};
    if (!hasSpecialChar) return {status: 0, message: messages.specialChar};
  
    return {status: 1} ;
  }

export const createUser = async (req, res) => {
    const result = {
        status: 0,
        error: ""
    }
    const { email, password } = req.body;
    const isSafe = isSecurePassword(password);

    if ( !isSafe.status ) {
        result.error = isSafe.message;
        res.status(400).json(result);
        return;
    }

    const hashString = await hash(password, 10);

    readFile('./src/json/user.json', (err, jsonString) => {
        if (err) {
            result.error = "Error reading file";
            res.status(500).json(result);
            return;
        }

        const data = JSON.parse(jsonString);

        if (data.email && data.password) {
            result.error = "An user already exist";
            res.status(500).json(result);
            return;
        }

        const newUser = {
            email: email,
            password: hashString
        }

        const json = JSON.stringify(newUser, null, 2);

        writeFile('./src/json/user.json', json, (err) => {
            if (err) {
                result.error = "Error wrting on file";
                res.status(500).json(result);
                return;
            }

            result.status = 1;
            res.json(result);
        })
    });
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
        readFile('./src/json/user.json', async (err, jsonString) => {
            if (err) {
                result.error = "Error reading file";
                res.status(500).json(result);
                return;
            }

            const data = JSON.parse(jsonString);

            if (!data.email && !data.password) {
                result.error = "There's no user signed up yet";
                res.status(500).json(result);
                return;
            }

            const match = await compare(password, data.password);

            //give back error if credentials are wrong
            if (email !== data.email || !match) {
                result.error = "Wrong credentials";
                res.status(500).json(result);
                return;
            }

            const token = jwt.sign({"email": data.email}, process.env.SECRET, {expiresIn: 84600});
            
            result.status = 1;
            result.data = {
                "token": token
            }

            res.json(result);
        });
    } catch (err) {
        result.error = "Error reading file";
        res.status(500).json(result);
    }
}