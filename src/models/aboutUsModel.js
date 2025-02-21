import mongoose from "mongoose";

const aboutUsSchema = new mongoose.Schema({
    email: { type: [String], required: true }, 
    password: { type: String, required: true }, 

    totalNumber: { type: [Number], required: true }, 
    totalEmployees: { type: [Number], required: true }, 
    totalVendor: { type: [Number], required: true }, 
    totalUsers: { type: [Number], required: true }, 
    description: { type: [String], required: true }, 
    team: [
        {
        name: { type: String, required: true },
        designation: { type: String, required: true },
        //   image: { type: String, required: true },
        },
    ], 
    });


const AboutUs = mongoose.model('AboutUs', aboutUsSchema);

export default AboutUs;


