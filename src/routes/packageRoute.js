import express from "express";
import {createPackage, updatePackage} from "../controllers/packageController.js"

const router = express.Router();

router.post("/createPackage", createPackage);
router.put("/updatePackage/:id", updatePackage);

export default router;