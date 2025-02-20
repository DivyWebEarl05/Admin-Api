import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";

// Insert Data
const insertData = async (req, res) => {
  try {
    const { email, number, description, password, address } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.every((e) => emailRegex.test(e))) {
      return res.status(400).json({ message: "Please enter valid email addresses" });
    }

    const mobileRegex = /^\d{10}$/;
    if (!number.every((n) => mobileRegex.test(n.toString()))) {
      return res.status(400).json({ message: "Please enter valid 10-digit mobile numbers" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newData = new Admin({
      email: Array.isArray(email) ? email : [email],
      number: Array.isArray(number) ? number : [number],
      description: Array.isArray(description) ? description : [description],
      password: hashedPassword,
      address: Array.isArray(address) ? address : [address],
    });

    await newData.save();

    res.status(201).json({ message: "Data inserted successfully", data: [newData] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Data
const getData = async (req, res) => {
  try {
    const data = await Admin.find().select("-password");
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateData = async (req, res) => {
    try {
      const { id } = req.params;
      const { email, number, description, password, address } = req.body;
  
      const existingData = await Admin.findById(id);
      if (!existingData) {
        return res.status(404).json({ message: "Data not found" });
      }
  
      // If password is provided, hash it
      if (password) {
        const salt = await bcrypt.genSalt(10);
        existingData.password = await bcrypt.hash(password, salt);
      }
  
      // Ensure all fields are stored as arrays
      existingData.email = email ? (Array.isArray(email) ? email : [email]) : existingData.email;
      existingData.number = number ? (Array.isArray(number) ? number : [number]) : existingData.number;
      existingData.description = description ? (Array.isArray(description) ? description : [description]) : existingData.description;
      existingData.address = address ? (Array.isArray(address) ? address : [address]) : existingData.address;
  
      await existingData.save();
  
      res.status(200).json({ message: "Data updated successfully", data: [existingData] });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
export {
    insertData,
    updateData,
    getData
};