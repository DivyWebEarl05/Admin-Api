import Blog from "../models/blogModel.js"
import mongoose from "mongoose";


// const createBlog = async (req, res) => {
//   try {
//     const { blog_title, blog_description, photo1_description, photo2_description, selected_package, aboutBlogPoints } = req.body;

//     // Handle image uploads
//     const photo1 = req.files["photo1"] ? req.files["photo1"][0].path : null;
//     const photo2 = req.files["photo2"] ? req.files["photo2"][0].path : null;
//     const photoArray = req.files["photoArray"] ? req.files["photoArray"].map(file => file.path) : [];
//     const aboutBlogImage = req.files["aboutBlogImage"] ? req.files["aboutBlogImage"][0].path : null;

//     // If there are points, create the aboutBlog structure
//     const aboutBlog = aboutBlogPoints ? [{
//       points: aboutBlogPoints,  // Points array received in the request
//       image: aboutBlogImage,    // Same image for all points in the aboutBlog object
//     }] : [];

//     // Create the new blog object
//     const newBlog = new Blog({
//       blog_title,
//       blog_description,
//       photo1,
//       photo1_description,
//       photo2,
//       photo2_description,
//       photoArray,
//       aboutBlog,  // This will contain a single object with points and the image
//       selected_package: selected_package ? new mongoose.Types.ObjectId(selected_package) : null,
//     });

//     // Save the blog
//     await newBlog.save();

//     // Return success response
//     res.status(201).json({ message: "Blog created successfully!", blog: newBlog });
//   } catch (error) {
//     // Return error response
//     res.status(500).json({ message: "Error creating blog", error: error.message });
//   }
// };
const createBlog = async (req, res) => {
  try {
    const baseUrl = "https://admin-api-1xs0.onrender.com/";

    const { blog_title, blog_description, photo1_description, photo2_description, selected_package, aboutBlogPoints } = req.body;

    // Handle image uploads
    const photo1 = req.files["photo1"] ? baseUrl + req.files["photo1"][0].path.replace(/\\/g, "/") : null;
    const photo2 = req.files["photo2"] ? baseUrl + req.files["photo2"][0].path.replace(/\\/g, "/") : null;
    const photoArray = req.files["photoArray"] ? req.files["photoArray"].map(file => baseUrl + file.path.replace(/\\/g, "/")) : [];
    const aboutBlogImage = req.files["aboutBlogImage"] ? baseUrl + req.files["aboutBlogImage"][0].path.replace(/\\/g, "/") : null;

    // If there are points, create the aboutBlog structure
    const aboutBlog = aboutBlogPoints ? [{
      points: aboutBlogPoints,  // Points array received in the request
      image: aboutBlogImage,    // Image with full accessible URL
    }] : [];

    // Create the new blog object
    const newBlog = new Blog({
      blog_title,
      blog_description,
      photo1,
      photo1_description,
      photo2,
      photo2_description,
      photoArray,
      aboutBlog,  // This will contain a single object with points and the image
      selected_package: selected_package ? new mongoose.Types.ObjectId(selected_package) : null,
    });

    // Save the blog
    await newBlog.save();

    // Return success response
    res.status(201).json({ message: "Blog created successfully!", blog: newBlog });
  } catch (error) {
    // Return error response
    res.status(500).json({ message: "Error creating blog", error: error.message });
  }
};

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
            aboutBlog: {
              $map: {
                input: "$aboutBlog",  // iterate over aboutBlog array
                as: "item",
                in: {
                  points: "$$item.points", // points array
                  image: "$$item.image"   // single image
                }
              }
            },
            "packageDetails.package_name": 1, 
          },
        },
      ]);
  
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blogs", error: error.message });
    }
  };
  

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
        {
          $project: {
            blog_title: 1,
            blog_description: 1,
            photo1: 1,
            photo1_description: 1,
            photo2: 1,
            photo2_description: 1,
            photoArray: 1,
            aboutBlog: {
              $map: {
                input: "$aboutBlog",  // iterate over aboutBlog array
                as: "item",
                in: {
                  points: "$$item.points", // points array
                  image: "$$item.image"   // single image
                }
              }
            },
            "packageDetails.package_name": 1, 
          },
        },
      ]);
  
      if (!blog.length) return res.status(404).json({ message: "Blog not found" });
  
      res.status(200).json(blog[0]);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog", error: error.message });
    }
  };
  
const updateBlog = async (req, res) => {
    try {
      const { blog_title, blog_description, photo1_description, photo2_description, selected_package, aboutBlogPoints } = req.body;
  
      // Prepare updated fields object
      const updatedFields = {
        blog_title,
        blog_description,
        photo1_description,
        photo2_description,
        selected_package: selected_package ? new mongoose.Types.ObjectId(selected_package) : null,
      };
  
      // Handle the aboutBlog update
      if (aboutBlogPoints) {
        // Ensure aboutBlogPoints is treated as an array
        const points = Array.isArray(aboutBlogPoints) ? aboutBlogPoints : JSON.parse(aboutBlogPoints);
        updatedFields.aboutBlog = [{
          points: points, // Use the points array
          image: req.files["aboutBlogImage"] ? req.files["aboutBlogImage"][0].path : undefined, // Add the image if provided
        }];
      }
  
      // Handle file uploads (photo1, photo2, photoArray)
      if (req.files["photo1"]) updatedFields.photo1 = req.files["photo1"][0].path;
      if (req.files["photo2"]) updatedFields.photo2 = req.files["photo2"][0].path;
      if (req.files["photoArray"]) updatedFields.photoArray = req.files["photoArray"].map(file => file.path);
  
      // Update the blog in the database
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