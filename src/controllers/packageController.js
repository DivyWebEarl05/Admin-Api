import Package from "../models/packageModel.js";

// Create a new package
const createPackage = async (req, res) => {
      try {
      //   console.log("Received Data:", req.body); // Debug incoming data
    
        const {
          user_id,
          destination,
          departure,
          hotel_type,
          mealsRequired,
          mealsType,
          sightseeing,
          extraRequirements,
          adults,
          children,
          infants,
          dateOfTravel,
          user_details,
          travelBy,
          destination_category,
        } = req.body;
    
        // Ensure all required fields are provided
        if (
          !user_id ||
          !destination ||
          !departure ||
          !hotel_type ||
          !extraRequirements ||
          !adults ||
          children === undefined || // Allow 0 as valid input
          infants === undefined ||  // Allow 0 as valid input
          !dateOfTravel ||
          !user_details?.name ||
          !user_details?.email ||
          !user_details?.phoneNumber ||
          !user_details?.budget
        ) {
          return res.status(400).json({ error: "Missing required fields" });
        }
    
        const newPackage = new Package({
          user_id,
          destination,
          departure,
          hotel_type,
          mealsRequired,
          mealsType,
          sightseeing,
          extraRequirements,
          adults,
          children,
          infants,
          dateOfTravel,
          user_details,
          travelBy,
          destination_category,
        });
    
        const savedPackage = await newPackage.save();
    
        res.status(201).json({ message: "Package created successfully", data: savedPackage });
      } catch (error) {
        console.error("Error:", error); // Debugging error
        res.status(400).json({ error: error.message });
      }
    };


// Update an existing package
const updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Find and update package
        const updatedPackage = await Package.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

        if (!updatedPackage) {
            return res.status(404).json({ error: "Package not found" });
        }

        res.status(200).json({ message: "Package updated successfully", package: updatedPackage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export{
  createPackage,
  updatePackage
}