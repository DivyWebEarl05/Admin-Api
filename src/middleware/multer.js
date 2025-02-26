import multer from "multer";
import path from "path";

// Define storage for different image types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadFolder = "uploads/";

    if (file.fieldname === "photo1") {
      uploadFolder += "photo1/";
    } else if (file.fieldname === "photo2") {
      uploadFolder += "photo2/";
    } else if (file.fieldname === "photoArray") {
      uploadFolder += "photoArray/";
    } else if (file.fieldname === "aboutBlogImage") {
      uploadFolder += "aboutBlog/";
    }

    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedExtensions.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, gif) are allowed!"), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

export default upload;