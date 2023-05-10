import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
   const sqlGet = req.query.cat 
   ? "SELECT * FROM posts WHERE cat = ?" 
   : "SELECT * FROM posts";

   db.query(sqlGet, [req.query.cat], (err, result) => {
    if(err) return res.status(500).send(err);

    return res.status(200).json(result);
   });
};

export const getPost = (req, res) => {
    const sqlGet = "SELECT p.id, username, title, p.desc, p.img, u.img AS userImg, cat, date FROM users u JOIN posts p ON u.id = p.userid WHERE p.id = ?";

    db.query(sqlGet, [req.params.id], (err, result) => {
        if(err) return res.status(500).json(err);

        return res.status(200).json(result[0]);
    });
};

export const addPost = (req, res) => {
    const token = req.cookies.access_token;

    if(!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!");

        const sqlInsert = "INSERT INTO posts (title, desc, img, cat, date, userid) VALUES (?)";

        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
            req.body.date,
            userInfo.id
        ];

        db.query(sqlInsert, [values], (err, result) => {
            if(err){
                return res.status(500).json(err);
            } 
            return res.json("Post has been created.");
        });
    });
};

export const deletePost = (req, res) => {
    //checks if a user is logged in
    const token = req.cookies.access_token;

    if(!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if(err)return res.status(403).json("Token is not valid!");

        const postId = req.params.id;
        const sqlDelete = "DELETE FROM posts WHERE id = ? AND userid = ?";

        db.query(sqlDelete, [postId, userInfo.id], (err, result) => {
            if (err) return res.status(403).json("You can't delete this post as it doesn't belong to you!");

            return res.json("Post has been deleted");
        })
    })
};

export const updatePost = (req, res) => {
    const token = req.cookies.access_token;

    if(!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if(err)return res.status(403).json("Token is not valid!");
        
        const sqlInsert = "UPDATE posts SET title = ?, desc = ?, img = ?, cat = ? WHERE id = ? AND userid = ?";
        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
        ];
        const postId = req.params.id;

        db.query(sqlInsert, [...values, postId, userInfo.id], (err, result) => {
            if(err) return res.status(500).json(err);
            return res.json("Post has been updated.");
        });
    });
};