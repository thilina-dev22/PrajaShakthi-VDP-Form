const Submission = require("../models/SubmissionModel");
const { logActivity } = require("../utils/activityLogger");
const { 
  notifySuperAdmins, 
  notifyDistrictAdmins,
  checkDuplicateNIC 
} = require("../utils/notificationHelper");

// @desc   Create a new form submission
// @route  POST /api/submissions
// @access Public (anonymous submissions allowed)
const createSubmission = async (req, res) => {
  try {
    const user = req.user;
    
    // Validation: Only one CDC form submission per GN Division
    if (req.body.formType === 'council_info') {
      const existingSubmission = await Submission.findOne({
        formType: 'council_info',
        'location.district': req.body.location?.district,
        'location.divisionalSec': req.body.location?.divisionalSec,
        'location.gnDivision': req.body.location?.gnDivision
      });

      if (existingSubmission) {
        return res.status(400).json({ 
          message: `A CDC form has already been submitted for ${req.body.location?.gnDivision} GN Division. Only one submission per GN Division is allowed.`,
          existingSubmissionId: existingSubmission._id
        });
      }
    }
    
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

// @desc   Get all submissions (with filtering based on role) - PAGINATED
// @route   GET /api/submissions
// @access Private
const getSubmissions = async (req, res) => {
  const { 
    district, 
    divisionalSec, 
    gnDivision, 
    formType,
    page = 1,
    limit = 50,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
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
    // Convert to numbers and validate
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 per page
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const [submissions, totalCount] = await Promise.all([
      Submission.find(filter)
        .select('-__v') // Exclude version field
        .populate('createdBy', 'username fullName')
        .populate('lastModifiedBy', 'username fullName')
        .populate({
          path: 'editHistory.editedBy',
          select: 'username fullName',
          options: { limit: 5 } // Limit edit history population
        })
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(), // Use lean() for better performance
      Submission.countDocuments(filter)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    // Log activity (async, don't wait)
    logActivity({
      userId: user._id,
      username: user.username,
      userRole: user.role,
      action: 'VIEW_SUBMISSIONS',
      details: { 
        count: submissions.length,
        totalCount,
        page: pageNum,
        filters: { district, divisionalSec, gnDivision, formType }
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      district: user.district,
      divisionalSecretariat: user.divisionalSecretariat
    }).catch(err => console.error('Error logging activity:', err));

    res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
        hasNextPage,
        hasPrevPage
      }
    });
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

    // Validation: If changing location for council_info, ensure no duplicate exists for new GN Division
    if (submission.formType === 'council_info' && req.body.location) {
      const isLocationChanging = 
        (req.body.location.district && req.body.location.district !== submission.location.district) ||
        (req.body.location.divisionalSec && req.body.location.divisionalSec !== submission.location.divisionalSec) ||
        (req.body.location.gnDivision && req.body.location.gnDivision !== submission.location.gnDivision);

      if (isLocationChanging) {
        const newDistrict = req.body.location.district || submission.location.district;
        const newDS = req.body.location.divisionalSec || submission.location.divisionalSec;
        const newGN = req.body.location.gnDivision || submission.location.gnDivision;

        const existingSubmission = await Submission.findOne({
          _id: { $ne: submission._id }, // Exclude current submission
          formType: 'council_info',
          'location.district': newDistrict,
          'location.divisionalSec': newDS,
          'location.gnDivision': newGN
        });

        if (existingSubmission) {
          return res.status(400).json({ 
            message: `A Community Council form already exists for ${newGN} GN Division in ${newDS}, ${newDistrict}. Each GN Division can only have one Community Council form.` 
          });
        }
      }
    }

    // Detect changes for detailed logging
    const changes = [];
    const detailedChanges = []; // Structured change data for notifications
    const oldData = submission.toObject();
    
    // Check location changes
    if (req.body.location) {
      if (req.body.location.gnDivision && req.body.location.gnDivision !== oldData.location.gnDivision) {
        changes.push(`GN Division: ${oldData.location.gnDivision} → ${req.body.location.gnDivision}`);
        detailedChanges.push({
          field: 'GN Division',
          fieldKey: 'location.gnDivision',
          oldValue: oldData.location.gnDivision,
          newValue: req.body.location.gnDivision,
          category: 'location'
        });
      }
      if (req.body.location.divisionalSec && req.body.location.divisionalSec !== oldData.location.divisionalSec) {
        changes.push(`DS Division: ${oldData.location.divisionalSec} → ${req.body.location.divisionalSec}`);
        detailedChanges.push({
          field: 'DS Division',
          fieldKey: 'location.divisionalSec',
          oldValue: oldData.location.divisionalSec,
          newValue: req.body.location.divisionalSec,
          category: 'location'
        });
      }
      if (req.body.location.district && req.body.location.district !== oldData.location.district) {
        changes.push(`District: ${oldData.location.district} → ${req.body.location.district}`);
        detailedChanges.push({
          field: 'District',
          fieldKey: 'location.district',
          oldValue: oldData.location.district,
          newValue: req.body.location.district,
          category: 'location'
        });
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
            ['name', 'position', 'phone', 'whatsapp', 'email', 'nic', 'gender', 'permanentAddress'].forEach(field => {
              const oldVal = oldMember[field] || '';
              const newVal = member[field] || '';
              if (newVal && newVal !== oldVal) {
                const sectionName = section === 'committeeMembers' ? 'Committee Member' : 
                                  section === 'communityReps' ? 'Community Rep' : 'Strategic Member';
                changes.push(`${sectionName} #${idx + 1} ${field}: ${oldVal || 'empty'} → ${newVal}`);
                detailedChanges.push({
                  field: `${sectionName} #${idx + 1} - ${field.charAt(0).toUpperCase() + field.slice(1)}`,
                  fieldKey: `communityCouncil.${section}[${idx}].${field}`,
                  oldValue: oldVal,
                  newValue: newVal,
                  category: 'member',
                  section: sectionName,
                  memberIndex: idx,
                  memberField: field
                });
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
        changes: changeDescription.length > 100 ? changeDescription.substring(0, 100) + '...' : changeDescription,
        changeCount: detailedChanges.length,
        detailedChanges: detailedChanges // Pass structured change data
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
