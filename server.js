import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";

// Routes For ALL
import adminRoute from "./src/routes/adminRoute.js";
import aboutusRoute from "./src/routes/aboutusRoute.js";
import packageRoute from "./src/routes/packageRoute.js";
import blogRoute from "./src/routes/blogRoute.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
// app.use(express.urlencoded({ extended: true })); 


// Api For Routes
app.use('/api', adminRoute);
app.use('/api', aboutusRoute);
app.use('/api', packageRoute);
app.use('/api/blog', blogRoute);


// IN case Fail Config db.js
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log("SERVER RUNNING ON PORT:", process.env.PORT);
        });
    })
    .catch((err) => {
        console.log("MONGODB CONNECTION FAILED: ", err);
    });