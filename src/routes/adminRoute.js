import express from "express";
import {insertData, updateData, getData } from "../controllers/adminController.js"


const router = express.Router();

router.post("/contact-us/insert", insertData);
router.put("/contact-us/update/:id", updateData);
router.get("/contact-us/display", getData);

export default router;