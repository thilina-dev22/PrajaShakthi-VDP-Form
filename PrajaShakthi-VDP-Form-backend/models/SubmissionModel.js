const mongoose = require("mongoose");

// Define the Schema for a single Council Member
const CouncilMemberSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    position: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
  },
  { _id: false }
);

const SubmissionSchema = new mongoose.Schema(
  {
    location: {
      district: String,
      divisionalSec: String,
      gnDivision: String,
      cdcVdpId: String,
    },

    // ⭐ CRITICAL FIX: New Structured Council Data Schema ⭐
    communityCouncil: {
      type: new mongoose.Schema(
        {
          committeeMembers: [CouncilMemberSchema], // Rows 1-5
          communityReps: [CouncilMemberSchema], // Rows 6-20
          strategicMembers: [CouncilMemberSchema], // Rows 21-25
        },
        { _id: false }
      ),
      required: false, // Allow submission if the council is empty
    },
    // ⭐ END CRITICAL FIX ⭐

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