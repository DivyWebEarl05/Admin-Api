import express from "express";
import {uploadData, updateData, getData } from "../controllers/aboutusController.js"


const router = express.Router();

router.post("/about-us/upload", uploadData);
router.put("/about-us/update/:id", updateData);
router.get("/about-us/display", getData);

export default router;