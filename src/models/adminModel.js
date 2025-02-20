import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: [String], required: true },
  number: { type: [Number], required: true }, 
  description: { type: [String], required: true }, 
  password: { type: String, required: true }, 
  address: [
    {
      fullAddress: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: Number, required: true },
    },
  ], 
});


const Admin = mongoose.model('Admin', adminSchema);

export default Admin;