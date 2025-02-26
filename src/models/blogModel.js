import mongoose from "mongoose";

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const blogSchema = new mongoose.Schema({
    photo1: { 
        type: String, 
        required: true 
    }, 
    photo1_description: { 
        type: String, 
        required: true 
    },

    photo2: { 
        type: String, 
        required: true 
    },
    photo2_description: { 
        type: String, 
        required: true 
    },

    photoArray: [{ 
        type: String,
        required: true
    }], 

    aboutBlog: {
        point: [{ 
            type: String 
        }], 

        image: { 
            type: String 
        }, // Single image 
    },

    blog_description: { 
        type: String, 
        required: true 
    },

    blog_title: { 
        type: String, 
        required: true 
    },
    
    selected_package: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Package" 
    }, // Reference to another collection
}, 
{
    timestamps: {
        currentTime: () => getISTTime()
    }
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;