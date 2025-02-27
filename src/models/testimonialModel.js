import mongoose from "mongoose";

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    photo: { 
        type: String, 
        required: true 
    },

    star: {
        type: String,
        required: true,
        enum: ['1','2','3', '4', '5'],
    },
    
    Description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
      },
}, 
{
    timestamps: {
        currentTime: () => getISTTime()
    }
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;