import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";

import adminRoute from "./src/routes/adminRoute.js"
import aboutusRoute from "./src/routes/aboutusRoute.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use('/api', adminRoute);
app.use('/api', aboutusRoute);

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log("SERVER RUNNING ON PORT:", process.env.PORT);
        });
    })
    .catch((err) => {
        console.log("MONGODB CONNECTION FAILED: ", err);
    });