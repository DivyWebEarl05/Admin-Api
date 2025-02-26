import express from "express";
import {createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} from "../controllers/blogController.js"
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/create",
    upload.fields([
      { name: "photo1", maxCount: 1 },
      { name: "photo2", maxCount: 1 },
      { name: "photoArray", maxCount: 10 },
      { name: "aboutBlogImage", maxCount: 1 },
    ]),
    createBlog
  );
  
router.get("/getall", getAllBlogs);
router.get("/getblogById/:id", getBlogById);
  
router.put("/update/:id",
    upload.fields([
      { name: "photo1", maxCount: 1 },
      { name: "photo2", maxCount: 1 },
      { name: "photoArray", maxCount: 10 },
      { name: "aboutBlogImage", maxCount: 1 },
    ]),
    updateBlog
  );
  
router.delete("/delete/:id", deleteBlog);

export default router;