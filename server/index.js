import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//to upload files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage });

app.post('/server/upload', upload.single('file'), function(req, res){
    const file = req.file;
    res.status(200).json(file.filename);
});

app.use(bodyParser.urlencoded({extended: true}));
app.use("/server/auth", authRoutes);
app.use("/server/posts", postRoutes);
app.use("/server/users", userRoutes);


app.listen(8000, () => {
    console.log("Connected");
});