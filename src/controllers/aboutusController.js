import AboutUs from "../models/aboutUsModel.js";
import bcrypt from "bcryptjs";

const uploadData = async (req, res) => {
  try {
      const { email, password, totalDownload, totalEmployees, totalVendor, totalUsers, description, team } = req.body;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.every((e) => emailRegex.test(e))) {
          return res.status(400).json({ message: "Please enter valid email addresses" });
      }

      if (!password) {
          return res.status(400).json({ message: "Password is required" });
      }

      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Check if team is an array and contains objects with 'name' and 'designation' properties
      if (!Array.isArray(team)) {
          return res.status(400).json({ message: "'team' should be an array of objects with 'name' and 'designation'" });
      }

      // Validate each team member object
      for (const member of team) {
          if (!member.name || !member.designation) {
              return res.status(400).json({ message: "Each team member should have 'name' and 'designation'" });
          }
      }

      // Create the new data object
      const newData = new AboutUs({
          email: Array.isArray(email) ? email : [email],
          totalDownload: Array.isArray(totalDownload) ? totalDownload : [totalDownload],
          totalEmployees: Array.isArray(totalEmployees) ? totalEmployees : [totalEmployees],
          totalVendor: Array.isArray(totalVendor) ? totalVendor : [totalVendor],
          totalUsers: Array.isArray(totalUsers) ? totalUsers : [totalUsers],
          description: Array.isArray(description) ? description : [description],
          password: hashedPassword,
          team: team,  // Directly use the team array
      });

      await newData.save();

      res.status(201).json({ message: "Data inserted successfully", data: [newData] });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, totalDownload, totalEmployees, totalVendor, totalUsers, description, team } = req.body;

    const existingData = await AboutUs.findById(id);
    if (!existingData) {
      return res.status(404).json({ message: "Data not found" });
    }

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      existingData.password = await bcrypt.hash(password, salt);
    }

    // Ensure all fields are stored as arrays
    existingData.totalDownload = totalDownload
      ? (Array.isArray(totalDownload) ? totalDownload : [totalDownload])
      : existingData.totalDownload;
    existingData.totalEmployees = totalEmployees
      ? (Array.isArray(totalEmployees) ? totalEmployees : [totalEmployees])
      : existingData.totalEmployees;
    existingData.totalVendor = totalVendor
      ? (Array.isArray(totalVendor) ? totalVendor : [totalVendor])
      : existingData.totalVendor;
    existingData.totalUsers = totalUsers
      ? (Array.isArray(totalUsers) ? totalUsers : [totalUsers])
      : existingData.totalUsers;
    existingData.description = description
      ? (Array.isArray(description) ? description : [description])
      : existingData.description;

    // Check and validate the team field
    if (team) {
      if (!Array.isArray(team)) {
        return res.status(400).json({ message: "'team' should be an array of objects with 'name' and 'designation'" });
      }

      // Validate each team member
      for (const member of team) {
        if (!member.name || !member.designation) {
          return res.status(400).json({ message: "Each team member should have 'name' and 'designation'" });
        }
      }

      // Update the team field
      existingData.team = team;
    }

    await existingData.save();

    res.status(200).json({ message: "Data updated successfully", data: [existingData] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get All Data
const getData = async (req, res) => {
    try {
      const data = await AboutUs.find().select("-password");
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


export {
  uploadData,
    updateData,
    getData
}

