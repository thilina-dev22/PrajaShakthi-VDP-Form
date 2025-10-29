const Submission = require("../models/SubmissionModel");
const { logActivity } = require("../utils/activityLogger");
const { 
  notifySuperAdmins, 
  notifyDistrictAdmins,
  checkDuplicateNIC 
} = require("../utils/notificationHelper");

// @desc   Create a new form submission
// @route  POST /api/submissions
// @access Public (anonymous submissions allowed)
const createSubmission = async (req, res) => {
  try {
    const user = req.user;
    
    // Automatically set createdBy from authenticated user
    const submissionData = {
      ...req.body,
      createdBy: user._id,
      lastModifiedBy: user._id
    };
    
    const newSubmission = new Submission(submissionData);
    const savedSubmission = await newSubmission.save();

    // Log activity
    await logActivity({
      userId: user._id,
      username: user.username,
      userRole: user.role,
      action: 'CREATE_SUBMISSION',
      details: { 
        submissionId: savedSubmission._id,
        formType: savedSubmission.formType,
        location: savedSubmission.location
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      district: user.district,
      divisionalSecretariat: user.divisionalSecretariat
    });

    // Notify super admins for council_info and development_plan submissions (Phase 1)
    if (['council_info', 'development_plan'].includes(savedSubmission.formType)) {
      const notificationDetails = {
        district: savedSubmission.location.district,
        dsDivision: savedSubmission.location.divisionalSec,
        gnDivision: savedSubmission.location.gnDivision,
        formType: savedSubmission.formType
      };

      await notifySuperAdmins(
        'CREATE_SUBMISSION',
        {
          submissionId: savedSubmission._id,
          details: notificationDetails
        },
        user,
        'medium',
        'submission'
      );

      // Also notify district admin (Phase 1)
      await notifyDistrictAdmins(
        savedSubmission.location.district,
        'CREATE_SUBMISSION',
        {
          submissionId: savedSubmission._id,
          details: notificationDetails
        },
        user,
        'low',
        'submission'
      );
    }

    // Check for duplicate NIC entries (Phase 2)
    if (savedSubmission.communityCouncil && savedSubmission.communityCouncil.committeeMembers) {
      for (const member of savedSubmission.communityCouncil.committeeMembers) {
        if (member.nic) {
          await checkDuplicateNIC(member.nic, savedSubmission._id);
        }
      }
    }

    res.status(201).json({
      message: "Submission saved successfully!",
      data: savedSubmission,
    });
  } catch (error) {
    console.error("Error saving submission:", error);
    res
      .status(500)
      .json({ message: "Error saving submission", error: error.message });
  }
};

// @desc   Get all submissions (with filtering based on role)
// @route   GET /api/submissions
// @access Private
const getSubmissions = async (req, res) => {
  const { district, divisionalSec, gnDivision, formType } = req.query;
  const user = req.user;
  const filter = {};

  // Role-based filtering
  if (user.role === 'ds_user') {
    // DS users see only their own submissions
    filter.createdBy = user._id;
  } else if (user.role === 'district_admin') {
    // District admins see all submissions in their district
    filter['location.district'] = user.district;
  }
  // Superadmin sees everything (no additional filter)

  // Additional query filters
  if (district) {
    filter["location.district"] = district;
  }
  if (divisionalSec) {
    filter["location.divisionalSec"] = divisionalSec;
  }
  if (gnDivision) {
    filter["location.gnDivision"] = gnDivision;
  }
  if (formType) {
    filter.formType = formType;
  }

  try {
    const submissions = await Submission.find(filter)
      .populate('createdBy', 'username fullName')
      .populate('lastModifiedBy', 'username fullName')
      .populate('editHistory.editedBy', 'username fullName')
      .sort({ createdAt: -1 });

    // Log activity
    await logActivity({
      userId: user._id,
      username: user.username,
      userRole: user.role,
      action: 'VIEW_SUBMISSIONS',
      details: { 
        count: submissions.length,
        filters: { district, divisionalSec, gnDivision, formType }
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      district: user.district,
      divisionalSecretariat: user.divisionalSecretariat
    });

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res
      .status(500)
      .json({ message: "Error fetching submissions", error: error.message });
  }
};

const deleteSubmission = async (req, res) => {
  try {
    const user = req.user;
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Permission check: DS users can only delete their own submissions
    if (user.role === 'ds_user' && submission.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this submission" });
    }

    // District admins can only delete submissions from their district
    if (user.role === 'district_admin' && submission.location.district !== user.district) {
      return res.status(403).json({ message: "Not authorized to delete this submission" });
    }

    await submission.deleteOne();

    // Log activity
    await logActivity({
      userId: user._id,
      username: user.username,
      userRole: user.role,
      action: 'DELETE_SUBMISSION',
      targetType: 'Submission',
      targetId: submission._id,
      details: {
        formType: submission.formType,
        gnDivision: submission.location.gnDivision
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      district: user.district,
      divisionalSecretariat: user.divisionalSecretariat
    });

    // Notify super admins for council_info and development_plan submissions (Phase 1)
    if (['council_info', 'development_plan'].includes(submission.formType)) {
      const notificationDetails = {
        district: submission.location.district,
        dsDivision: submission.location.divisionalSec,
        gnDivision: submission.location.gnDivision,
        formType: submission.formType
      };

      await notifySuperAdmins(
        'DELETE_SUBMISSION',
        {
          submissionId: submission._id,
          details: notificationDetails
        },
        user,
        'medium',
        'submission'
      );
    }

    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc   Update a submission
// @route  PUT /api/submissions/:id
// @access Private (DS Users can edit their own)
const updateSubmission = async (req, res) => {
  try {
    const user = req.user;
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Permission check: DS users can only edit their own submissions
    if (user.role === 'ds_user' && submission.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this submission" });
    }

    // District admins can edit submissions from their district
    if (user.role === 'district_admin' && submission.location.district !== user.district) {
      return res.status(403).json({ message: "Not authorized to edit this submission" });
    }

    // Detect changes for detailed logging
    const changes = [];
    const oldData = submission.toObject();
    
    // Check location changes
    if (req.body.location) {
      if (req.body.location.gnDivision && req.body.location.gnDivision !== oldData.location.gnDivision) {
        changes.push(`GN Division: ${oldData.location.gnDivision} → ${req.body.location.gnDivision}`);
      }
    }

    // Check community council changes
    if (req.body.communityCouncil) {
      const sections = ['committeeMembers', 'communityReps', 'strategicMembers'];
      sections.forEach(section => {
        if (req.body.communityCouncil[section]) {
          const oldSection = oldData.communityCouncil?.[section] || [];
          const newSection = req.body.communityCouncil[section];
          
          newSection.forEach((member, idx) => {
            const oldMember = oldSection[idx] || {};
            ['name', 'position', 'phone', 'whatsapp', 'email'].forEach(field => {
              if (member[field] && member[field] !== oldMember[field]) {
                const sectionName = section === 'committeeMembers' ? 'Committee' : 
                                  section === 'communityReps' ? 'Community Rep' : 'Strategic';
                changes.push(`${sectionName} ${idx + 1} ${field}: ${oldMember[field] || 'empty'} → ${member[field]}`);
              }
            });
          });
        }
      });
    }

    const changeDescription = changes.length > 0 
      ? changes.join('; ') 
      : req.body.changeDescription || 'Updated submission';

    // Update fields
    Object.assign(submission, req.body);
    submission.lastModifiedBy = user._id;

    // Add to edit history with detailed changes
    submission.editHistory.push({
      editedBy: user._id,
      editedAt: new Date(),
      changes: changeDescription
    });

    await submission.save();

    // Log activity
    await logActivity({
      userId: user._id,
      username: user.username,
      userRole: user.role,
      action: 'UPDATE_SUBMISSION',
      targetType: 'Submission',
      targetId: submission._id,
      details: {
        formType: submission.formType,
        gnDivision: submission.location.gnDivision,
        changes: changeDescription
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      district: user.district,
      divisionalSecretariat: user.divisionalSecretariat
    });

    // Notify super admins for council_info and development_plan submissions (Phase 1)
    if (['council_info', 'development_plan'].includes(submission.formType)) {
      const notificationDetails = {
        district: submission.location.district,
        dsDivision: submission.location.divisionalSec,
        gnDivision: submission.location.gnDivision,
        formType: submission.formType,
        changes: changeDescription.length > 100 ? changeDescription.substring(0, 100) + '...' : changeDescription
      };

      await notifySuperAdmins(
        'UPDATE_SUBMISSION',
        {
          submissionId: submission._id,
          details: notificationDetails
        },
        user,
        'medium',
        'submission'
      );

      // Check for multiple edits (Phase 2)
      if (submission.editHistory.length >= 3) {
        await notifySuperAdmins(
          'MULTIPLE_EDITS',
          {
            submissionId: submission._id,
            details: {
              count: submission.editHistory.length,
              district: submission.location.district,
              formType: submission.formType
            }
          },
          user,
          'medium',
          'security'
        );
      }

      // Check for critical field changes (Phase 2)
      const criticalFields = ['position', 'nic', 'gender'];
      const criticalChanges = changes.filter(change => 
        criticalFields.some(field => change.toLowerCase().includes(field))
      );
      
      if (criticalChanges.length > 0) {
        await notifySuperAdmins(
          'CRITICAL_FIELD_CHANGE',
          {
            submissionId: submission._id,
            details: {
              changes: criticalChanges.join('; '),
              district: submission.location.district,
              formType: submission.formType
            }
          },
          user,
          'high',
          'security'
        );
      }
    }

    // Check for duplicate NIC in updated data (Phase 2)
    if (req.body.communityCouncil && req.body.communityCouncil.committeeMembers) {
      for (const member of req.body.communityCouncil.committeeMembers) {
        if (member.nic) {
          await checkDuplicateNIC(member.nic, submission._id);
        }
      }
    }

    res.json({
      message: "Submission updated successfully!",
      data: submission,
    });
  } catch (error) {
    console.error("Error updating submission:", error);
    res.status(500).json({ message: "Error updating submission", error: error.message });
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  updateSubmission,
  deleteSubmission,
};
