const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    location: {
        district: String,
        divisionalSec: String,
        gnDivision: String,
        cdcVdpId: String,
    },
    selection: {
        sector: String,
        subCategory: String,
        subSubCategory: String,
        subSubSubCategory: String,
    },
    data: mongoose.Schema.Types.Mixed,
    proposals: [{
        proposal: String,
        cost: String,
        agency: String,
    }],
}, {
    timestamps: true 
});

const Submission = mongoose.model('Submission', SubmissionSchema);

module.exports = Submission;