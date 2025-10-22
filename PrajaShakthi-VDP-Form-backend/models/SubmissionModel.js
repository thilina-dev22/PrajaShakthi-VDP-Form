const mongoose = require("mongoose");

// Define the Schema for a single Council Member
const CouncilMemberSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    position: { type: String, trim: true },
    phone: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    email: { type: String, trim: true },
  },
  { _id: false }
);

const SubmissionSchema = new mongoose.Schema(
  {
    // ⭐ ADD THIS FIELD ⭐
    formType: {
      type: String,
      enum: ['main_form', 'council_info'],
      default: 'main_form', // Default to main form for older data
    },
    // ⭐ END OF ADDITION ⭐
    
    location: {
      district: String,
      divisionalSec: String,
      gnDivision: String,
      cdcVdpId: String,
    },
    communityCouncil: {
      type: new mongoose.Schema(
        {
          committeeMembers: [CouncilMemberSchema],
          communityReps: [CouncilMemberSchema],
          strategicMembers: [CouncilMemberSchema],
        },
        { _id: false }
      ),
      required: false,
    },
    selection: {
      sector: String,
      subCategory: String,
      subSubCategory: String,
      subSubSubCategory: String,
    },
    data: mongoose.Schema.Types.Mixed,
    proposals: [
      {
        proposal: String,
        cost: String,
        agency: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model("Submission", SubmissionSchema);

module.exports = Submission;