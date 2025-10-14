import React, { useState, useEffect } from "react";
import { getSubmissions } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import provincialDataJson from "../data/provincial_data.json";
import './AdminTabs.css'; // We will create this CSS file next

const SubmissionList = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ⭐ NEW: State for active tab ⭐
  const [activeTab, setActiveTab] = useState('council_info'); // 'council_info' or 'main_form'

  // State for filtering submissions
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterDsDivision, setFilterDsDivision] = useState("");
  const [filterGnDivision, setFilterGnDivision] = useState("");

  // State for filter dropdowns
  const [districts, setDistricts] = useState([]);
  const [dsDivisions, setDsDivisions] = useState([]);
  const [gnDivisions, setGnDivisions] = useState([]);

  useEffect(() => {
    const allDistricts = provincialDataJson[0]?.districts || [];
    setDistricts(allDistricts);
  }, []);

  useEffect(() => {
    setDsDivisions([]);
    setGnDivisions([]);
    if (filterDistrict) {
      const selectedDistrictData = districts.find((d) => d.district.trim() === filterDistrict);
      if (selectedDistrictData) setDsDivisions(selectedDistrictData.ds_divisions);
    }
  }, [filterDistrict, districts]);

  useEffect(() => {
    setGnDivisions([]);
    if (filterDsDivision) {
      const selectedDsData = dsDivisions.find((ds) => ds.ds_division_name.trim() === filterDsDivision);
      if (selectedDsData) setGnDivisions(selectedDsData.gn_divisions);
    }
  }, [filterDsDivision, dsDivisions]);

  // ⭐ MODIFIED: Fetch submissions based on filters AND active tab ⭐
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      setLoading(false);
      return;
    }

    const fetchSubmissionsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {
          district: filterDistrict,
          divisionalSec: filterDsDivision,
          gnDivision: filterGnDivision,
          formType: activeTab, // <-- Pass the active tab as a filter
        };
        const cleanedFilters = Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v)
        );

        const data = await getSubmissions(cleanedFilters);
        setSubmissions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionsData();
  }, [isAuthenticated, isAdmin, filterDistrict, filterDsDivision, filterGnDivision, activeTab]); // <-- Add activeTab to dependency array

  const FilterPanel = () => (
    <div className="filter-panel form-container" style={{ marginBottom: "20px", padding: "20px" }}>
      <h3 className="section-title">Filter Submissions</h3>
      <div className="d-flex" style={{ gap: "20px" }}>
        {/* District Dropdown */}
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">District:</label>
          <select value={filterDistrict} onChange={(e) => { setFilterDistrict(e.target.value); setFilterDsDivision(""); setFilterGnDivision(""); }} className="form-control">
            <option value="">-- All Districts --</option>
            {districts.map((d) => (<option key={d.district.trim()} value={d.district.trim()}>{d.district.trim()}</option>))}
          </select>
        </div>
        {/* DS Division Dropdown */}
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">DS Division:</label>
          <select value={filterDsDivision} onChange={(e) => { setFilterDsDivision(e.target.value); setFilterGnDivision(""); }} className="form-control" disabled={!filterDistrict}>
            <option value="">-- All DS Divisions --</option>
            {dsDivisions.map((ds) => (<option key={ds.ds_division_name.trim()} value={ds.ds_division_name.trim()}>{ds.ds_division_name.trim()}</option>))}
          </select>
        </div>
        {/* GN Division Dropdown */}
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">GN Division:</label>
          <select value={filterGnDivision} onChange={(e) => setFilterGnDivision(e.target.value)} className="form-control" disabled={!filterDsDivision}>
            <option value="">-- All GN Divisions --</option>
            {gnDivisions.map((gn, index) => (<option key={`${gn.gn_name.trim()}-${index}`} value={gn.gn_name.trim()}>{gn.gn_name.trim()}</option>))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderCommunityCouncil = (councilData) => {
    if (!councilData || typeof councilData !== "object" || (!councilData.committeeMembers?.length && !councilData.communityReps?.length && !councilData.strategicMembers?.length)) {
      return <p>No council information submitted.</p>;
    }
    const sections = [
      { title: "කාරක සභා සාමාජිකයින් (1-5)", key: "committeeMembers", startRow: 1 },
      { title: "ප්‍රජා නියෝජිත කණ්ඩායම (6-20)", key: "communityReps", startRow: 6 },
      { title: "උපාය මාර්ගික සාමාජික කණ්ඩායම (21-25)", key: "strategicMembers", startRow: 21 },
    ];
    return (
      <div className="community-council-review">
        <h4 className="proposal-title">Community Development Council</h4>
        <table className="submission-data-table">
          <thead>
            <tr>
              <th>#</th><th>Name</th><th>Position</th><th>Phone</th><th>Email</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => {
              const members = councilData[section.key] || [];
              if (members.length === 0) return null;
              return (
                <React.Fragment key={section.key}>
                  <tr className="section-separator"><td colSpan="5"><strong>{section.title}</strong></td></tr>
                  {members.map((member, index) => {
                    const globalRowNumber = section.startRow + index;
                    return (
                      <tr key={`${section.key}-${globalRowNumber}`}>
                        <td>{globalRowNumber}</td><td>{member.name}</td><td>{member.position}</td><td>{member.phone}</td><td>{member.email}</td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  
// A simple renderer for the main form data
  const renderMainFormData = (submission) => {
      return (
          <div>
            {/* ⭐ MODIFIED: Added optional chaining (?.) for safety ⭐ */}
            <h4>{submission.selection?.sector || 'No Sector Selected'}</h4>
            <p><strong>Sub-Category:</strong> {submission.selection?.subCategory || 'N/A'}</p>

            {/* Also check if data exists before trying to display it */}
            {submission.data && Object.keys(submission.data).length > 0 ? (
                <pre>{JSON.stringify(submission.data, null, 2)}</pre>
            ) : (
                <p>No additional data for this submission.</p>
            )}

            {renderProposals(submission.proposals)}
          </div>
      );
  }

  const renderProposals = (proposals) => {
    if (!proposals || proposals.length === 0 || (proposals.length === 1 && !proposals[0].proposal)) {
      return null;
    }
    return (
      <>
        <h4 className="proposal-title">Proposals</h4>
        <table className="submission-data-table">
          <thead><tr><th>Proposal</th><th>Cost (Rs.)</th><th>Agency/Officer</th></tr></thead>
          <tbody>
            {proposals.map((prop, index) => (<tr key={prop._id || index}><td>{prop.proposal}</td><td>{prop.cost}</td><td>{prop.agency}</td></tr>))}
          </tbody>
        </table>
      </>
    );
  };

  if (!isAuthenticated) return <div>Access Denied. Please log in.</div>;
  if (!isAdmin) return <div>Access Denied. Admin role required.</div>;

  return (
    <div className="submission-list-container">
      <FilterPanel />

      {/* ⭐ TAB NAVIGATION ⭐ */}
      <div className="admin-tabs">
        <button className={activeTab === 'council_info' ? 'active' : ''} onClick={() => setActiveTab('council_info')}>
          Council Info Data (ප්‍රජා සභා තොරතුරු)
        </button>
        <button className={activeTab === 'main_form' ? 'active' : ''} onClick={() => setActiveTab('main_form')}>
          Main Form Data (සංවර්ධන සැලැස්ම)
        </button>
      </div>

      <h2>Filtered Submissions ({submissions.length})</h2>

      {loading && <div className="submission-card">Loading...</div>}
      {error && <div className="submission-card" style={{ color: "red" }}>Error: {error}</div>}
      
      {!loading && !error && submissions.length === 0 && (
        <div className="submission-card">No submissions found for this category.</div>
      )}

      {!loading && !error && submissions.map((submission) => (
        <div key={submission._id} className="submission-card">
          <div className="location-details">
            <p><strong>District:</strong> {submission.location.district}</p>
            <p><strong>DS Division:</strong> {submission.location.divisionalSec}</p>
            <p><strong>GN Division:</strong> {submission.location.gnDivision}</p>
            <p><strong>Submitted:</strong> {new Date(submission.createdAt).toLocaleDateString()}</p>
          </div>
          
          {/* ⭐ CONDITIONAL RENDERING BASED ON TAB ⭐ */}
          {activeTab === 'council_info' && renderCommunityCouncil(submission.communityCouncil)}
          {activeTab === 'main_form' && renderMainFormData(submission)}

        </div>
      ))}
    </div>
  );
};

export default SubmissionList;