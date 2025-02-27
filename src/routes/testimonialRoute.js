import express from 'express';
import {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController.js'; 
import upload from "../middleware/multer.js"

const router = express.Router();

router.post('/create', upload.single('photo'), createTestimonial);
router.get('/getall', getAllTestimonials);
router.get('/getbyid/:id', getTestimonialById);
router.put('/update/:id', upload.single('photo'), updateTestimonial);
router.delete('/delete/:id', deleteTestimonial);

export default router;