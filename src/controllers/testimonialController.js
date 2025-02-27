// Import the Testimonial model
import Testimonial from '../models/testimonialModel.js';

// Create a new testimonial
// export const createTestimonial = async (req, res) => {
//   try {
//     const { name, photo, star, Description } = req.body;
//     const fullPhotoUrl = "https://admin-api-1xs0.onrender.com/" + photo; // Assuming photo URL prefix

//     const newTestimonial = new Testimonial({
//       name,
//       photo: fullPhotoUrl,
//       star,
//       Description,
//       date: new Date()
//     });

//     await newTestimonial.save();

//     return res.status(201).json({
//       message: "Testimonial created successfully",
//       testimonial: newTestimonial
//     });
//   } catch (error) {
//     console.error("Error creating testimonial:", error);
//     return res.status(500).json({
//       message: "Failed to create testimonial",
//       error: error.message
//     });
//   }
// };
export const createTestimonial = async (req, res) => {
  try {
    // Check if the file exists in the request
    if (!req.file) {
      return res.status(400).json({
        message: "No photo uploaded!"
      });
    }

    // Get the uploaded file path (from Multer's storage configuration)
    const { name, star, Description } = req.body;
    const photo = req.file.path; // Path to the uploaded file (e.g., "uploads/testimonial/16742334612-photo.jpg")

    // Create the full URL for the uploaded image
    const photoUrl = `https://admin-api-1xs0.onrender.com/${photo.replace('uploads/', '')}`;

    // Create a new Testimonial document
    const newTestimonial = new Testimonial({
      name,
      photo: photoUrl,  // Save the correct full URL for the photo
      star,
      Description,
      date: new Date()
    });

    // Save the testimonial
    await newTestimonial.save();

    // Send the response with the newly created testimonial
    return res.status(201).json({
      message: "Testimonial created successfully",
      testimonial: newTestimonial
    });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return res.status(500).json({
      message: "Failed to create testimonial",
      error: error.message
    });
  }
};

// Get all testimonials
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    return res.status(200).json({
      testimonials
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return res.status(500).json({
      message: "Failed to fetch testimonials",
      error: error.message
    });
  }
};

// Get a testimonial by ID
export const getTestimonialById = async (req, res) => {
  const { id } = req.params;
  try {
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        message: "Testimonial not found"
      });
    }
    return res.status(200).json({
      testimonial
    });
  } catch (error) {
    console.error("Error fetching testimonial by ID:", error);
    return res.status(500).json({
      message: "Failed to fetch testimonial",
      error: error.message
    });
  }
};

// Update a testimonial by ID
export const updateTestimonial = async (req, res) => {
  const { id } = req.params;
  const { name, photo, star, Description } = req.body;

  try {
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      { name, photo, star, Description, date: new Date() },
      { new: true }
    );

    if (!updatedTestimonial) {
      return res.status(404).json({
        message: "Testimonial not found"
      });
    }

    return res.status(200).json({
      message: "Testimonial updated successfully",
      testimonial: updatedTestimonial
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return res.status(500).json({
      message: "Failed to update testimonial",
      error: error.message
    });
  }
};

// Delete a testimonial by ID
export const deleteTestimonial = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return res.status(404).json({
        message: "Testimonial not found"
      });
    }

    return res.status(200).json({
      message: "Testimonial deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return res.status(500).json({
      message: "Failed to delete testimonial",
      error: error.message
    });
  }
};
