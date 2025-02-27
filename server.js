import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Routes For ALL
import adminRoute from "./src/routes/adminRoute.js";
import aboutusRoute from "./src/routes/aboutusRoute.js";
import packageRoute from "./src/routes/packageRoute.js";
import blogRoute from "./src/routes/blogRoute.js";
import testimonialRoute from "./src/routes/testimonialRoute.js";

dotenv.config();

const app = express();
import path from "path";



app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// app.use(express.urlencoded({ extended: true })); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static files from the entire "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Api For Routes
app.use('/api', adminRoute);
app.use('/api', aboutusRoute);
app.use('/api', packageRoute);
app.use('/api/blog', blogRoute);
app.use('/api/testimonials', testimonialRoute)

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