import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
    //check if user exists
    const email = req.body.email;
    const username = req.body.username;
    const sqlGet = "SELECT * FROM users WHERE email = ? OR username = ?";

    db.query(sqlGet, [email, username], (err, result) => {
        if(err) return res.json(err);
        if(result.length) return res.status(409).json("User already exists!");

        //If no user exists, Hash the password and create a user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const sqlInsert = "INSERT INTO users (username, email, password) VALUES (?)";
        const values = [
            req.body.username,
            req.body.email,
            hash
        ];

        db.query(sqlInsert, [values], (err, result) => {
            if (err) return res.json(err);
            return res.status(200).json("User has been created");
        });
    });
};

export const login = (req, res) => {
    //check user
    const username = req.body.username;
    const sqlGet = "SELECT * FROM users WHERE username = ?";

    db.query(sqlGet, [username], (err, result) => {
        if(err) return res.json(err);
        if(result.length === 0) return res.status(404).json("User not found");

        //check password
        const isPasswordCorrect = bcrypt.compareSync(
            req.body.password, 
            result[0].password);

        if(!isPasswordCorrect) return res.status(400).json("Wrong username or password!");

        const token = jwt.sign({ id: result[0].id }, "jwtkey");
        const { password, ...other } = result[0]

        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(other)
    })
};

export const logout = (req, res) => {

    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("user has been logged out.");
    
};