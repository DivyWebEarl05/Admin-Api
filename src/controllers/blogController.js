import Blog from "../models/blogModel.js"
import mongoose from "mongoose";

// Create a new blog
const createBlog = async (req, res) => {
  try {
    const { blog_title, blog_description, photo1_description, photo2_description, selected_package, aboutBlogPoints } = req.body;

    const photo1 = req.files["photo1"] ? req.files["photo1"][0].path : null;
    const photo2 = req.files["photo2"] ? req.files["photo2"][0].path : null;
    const photoArray = req.files["photoArray"] ? req.files["photoArray"].map(file => file.path) : [];
    const aboutBlogImage = req.files["aboutBlogImage"] ? req.files["aboutBlogImage"][0].path : null;

    const newBlog = new Blog({
      blog_title,
      blog_description,
      photo1,
      photo1_description,
      photo2,
      photo2_description,
      photoArray,
      aboutBlog: {
        point: aboutBlogPoints ? JSON.parse(aboutBlogPoints) : [],
        image: aboutBlogImage,
      },
      selected_package: selected_package ? new mongoose.Types.ObjectId(selected_package) : null,
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog created successfully!", blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error: error.message });
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.aggregate([
      {
        $lookup: {
          from: "packages", 
          localField: "selected_package",
          foreignField: "_id",
          as: "packageDetails",
        },
      },
      {
        $unwind: {
          path: "$packageDetails",
          preserveNullAndEmptyArrays: true, 
        },
      },
      {
        $project: {
          blog_title: 1,
          blog_description: 1,
          photo1: 1,
          photo1_description: 1,
          photo2: 1,
          photo2_description: 1,
          photoArray: 1,
          "aboutBlog.point": 1,
          "aboutBlog.image": 1,
          "packageDetails.package_name": 1, 
        },
      },
    ]);

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
};

// Get a single blog by ID 
const getBlogById = async (req, res) => {
  try {
    const blogId = new mongoose.Types.ObjectId(req.params.id);
    const blog = await Blog.aggregate([
      { $match: { _id: blogId } }, 
      {
        $lookup: {
          from: "packages",
          localField: "selected_package",
          foreignField: "_id",
          as: "packageDetails",
        },
      },
      { $unwind: { path: "$packageDetails", preserveNullAndEmptyArrays: true } },
    ]);

    if (!blog.length) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error: error.message });
  }
};

// Update a blog 
const updateBlog = async (req, res) => {
  try {
    const { blog_title, blog_description, photo1_description, photo2_description, selected_package, aboutBlogPoints } = req.body;

    const updatedFields = {
      blog_title,
      blog_description,
      photo1_description,
      photo2_description,
      selected_package: selected_package ? new mongoose.Types.ObjectId(selected_package) : null,
      aboutBlog: {
        point: aboutBlogPoints ? JSON.parse(aboutBlogPoints) : [],
      },
    };

    if (req.files["photo1"]) updatedFields.photo1 = req.files["photo1"][0].path;
    if (req.files["photo2"]) updatedFields.photo2 = req.files["photo2"][0].path;
    if (req.files["photoArray"]) updatedFields.photoArray = req.files["photoArray"].map(file => file.path);
    if (req.files["aboutBlogImage"]) updatedFields.aboutBlog.image = req.files["aboutBlogImage"][0].path;

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({ message: "Blog updated successfully!", blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error: error.message });
  }
};

// Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({ message: "Blog deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error: error.message });
  }
};


export {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};