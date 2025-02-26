import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema(
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      destination: {
        type: String,
        required: true
      },
      departure: {
        type: String,
        required: true
      },
      hotel_type: {
        type: String,
        required: true,
        enum: ['3', '4', '5'],
      },

      mealsRequired: {
        notRequired: { 
          type: Boolean, 
          default: false 
        },
        breakfast: { 
          type: Boolean, 
          default: false 
        },
        lunch: { 
          type: Boolean, 
          default: false 
        },
        dinner: { 
          type: Boolean, 
          default: false 
        }
      },

      mealsType: {
        veg: { 
          type: Boolean, 
          default: false 
        },
        nonveg: { 
          type: Boolean, 
          default: false 
        }
      },

      sightseeing: {
        include: { 
          type: Boolean, 
          default: false 
        },
        exclude: { 
          type: Boolean, 
          default: false 
        }
      },

      extraRequirements: {
        type: String,
        required: true
      },
      adults: {
        type: Number,
        required: true
      },
      children: {
        type: Number,
        required: true,
        min: [0, 'Children cannot be less than zero.']
      },
      infants: {
        type: Number,
        required: true,
        min: [0, 'Infants cannot be less than zero.']
      },
      dateOfTravel: {
        type: Date,
        required: true
      },
      user_details: {
        name: {
          type: String,
          required: true
        },
        email: {
          type: String,
          required: true
        },
        phoneNumber: {
          type: Number,
          required: true
        },
        budget: {
          type: Number,
          required: true
        }
      },
      travelBy: [
        {
          type: String,
          enum: ['train', 'bus', 'flight', 'carCab'],
          default: []
        }
      ],
      destination_category: [
        {
          type: String,
          enum: ['pilgrimage', 'historical', 'wildlife', 'beach', 'honeymoon', 'nature', 'adventure'],
          default: []
        }
      ]
    },
    {
      timestamps: {
        currentTime: () => new Date() // Using server time
      }
    }
  );



PackageSchema.pre('save', function (next) {
    // If notRequired is true, disable all meal options
    if (this.mealsRequired.notRequired) {
        this.mealsRequired.breakfast = false;
        this.mealsRequired.lunch = false;
        this.mealsRequired.dinner = false;
    }

    // Ensure at least one meal is selected when notRequired is false
    if (!this.mealsRequired.notRequired) {
        let selectedMeals = [this.mealsRequired.breakfast, this.mealsRequired.lunch, this.mealsRequired.dinner].filter(Boolean).length;
        if (selectedMeals === 0) {
            return next(new Error('You must select at least one meal if "notRequired" is false.'));
        }
    }

    // Ensure only one meal type is selected
    if (this.mealsType.veg) this.mealsType.nonveg = false;
    if (this.mealsType.nonveg) this.mealsType.veg = false;

    // Ensure only one sightseeing option is selected
    if (this.sightseeing.include) this.sightseeing.exclude = false;
    if (this.sightseeing.exclude) this.sightseeing.include = false;

    next();
});

const Package = mongoose.model("Package", PackageSchema);

export default Package;