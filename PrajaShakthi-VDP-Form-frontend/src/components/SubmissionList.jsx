import React, { useState, useEffect } from "react";
import { getSubmissions } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import provincialDataJson from "../data/provincial_data.json";

const SubmissionList = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filtering submissions
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterDsDivision, setFilterDsDivision] = useState("");
  const [filterGnDivision, setFilterGnDivision] = useState("");

  // State for filter dropdowns
  const [districts, setDistricts] = useState([]);
  const [dsDivisions, setDsDivisions] = useState([]);
  const [gnDivisions, setGnDivisions] = useState([]);

  // Load initial district data for filtering dropdowns
  useEffect(() => {
    const allDistricts = provincialDataJson[0]?.districts || [];
    setDistricts(allDistricts);
  }, []);

  // Handle cascading dropdowns for filtering
  useEffect(() => {
    setDsDivisions([]);
    setGnDivisions([]);
    if (filterDistrict) {
      const selectedDistrictData = districts.find(
        (d) => d.district.trim() === filterDistrict
      );
      if (selectedDistrictData) {
        setDsDivisions(selectedDistrictData.ds_divisions);
      }
    }
  }, [filterDistrict, districts]);

  useEffect(() => {
    setGnDivisions([]);
    if (filterDsDivision) {
      const selectedDsData = dsDivisions.find(
        (ds) => ds.ds_division_name.trim() === filterDsDivision
      );
      if (selectedDsData) {
        setGnDivisions(selectedDsData.gn_divisions);
      }
    }
  }, [filterDsDivision, dsDivisions]);

  // Fetch submissions based on filters and authentication
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
        };
        const cleanedFilters = Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v) // Remove empty filter strings
        );

        const data = await getSubmissions(cleanedFilters); // Protected API call
        setSubmissions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionsData();
  }, [
    isAuthenticated,
    isAdmin,
    filterDistrict,
    filterDsDivision,
    filterGnDivision,
  ]);

  const FilterPanel = () => (
    <div
      className="filter-panel form-container"
      style={{ marginBottom: "20px", padding: "20px" }}
    >
      <h3 className="section-title">Filter Submissions</h3>
      <div className="d-flex" style={{ gap: "20px" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">District:</label>
          <select
            value={filterDistrict}
            onChange={(e) => {
              setFilterDistrict(e.target.value);
              setFilterDsDivision("");
              setFilterGnDivision("");
            }}
            className="form-control"
          >
            <option value="">-- All Districts --</option>
            {districts.map((d) => (
              <option key={d.district.trim()} value={d.district.trim()}>
                {d.district.trim()}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">DS Division:</label>
          <select
            value={filterDsDivision}
            onChange={(e) => {
              setFilterDsDivision(e.target.value);
              setFilterGnDivision("");
            }}
            className="form-control"
            disabled={!filterDistrict}
          >
            <option value="">-- All DS Divisions --</option>
            {dsDivisions.map((ds) => (
              <option
                key={ds.ds_division_name.trim()}
                value={ds.ds_division_name.trim()}
              >
                {ds.ds_division_name.trim()}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">GN Division:</label>
          <select
            value={filterGnDivision}
            onChange={(e) => setFilterGnDivision(e.target.value)}
            className="form-control"
            disabled={!filterDsDivision}
          >
            <option value="">-- All GN Divisions --</option>
            {gnDivisions.map((gn, index) => (
              <option
                key={`${gn.gn_name.trim()}-${index}`}
                value={gn.gn_name.trim()}
              >
                {gn.gn_name.trim()}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  // Function to render the structured Community Council data
  const renderCommunityCouncil = (councilData) => {
    // Check if the structured data exists and has any sub-arrays
    if (
      !councilData ||
      typeof councilData !== "object" ||
      (!councilData.committeeMembers?.length &&
        !councilData.communityReps?.length &&
        !councilData.strategicMembers?.length)
    ) {
      return null;
    }

    const sections = [
      {
        title: "කාරක සභා සාමාජිකයින් (1-5)",
        key: "committeeMembers",
        startRow: 1,
      },
      {
        title: "ප්‍රජා නියෝජිත කණ්ඩායම (6-20)",
        key: "communityReps",
        startRow: 6,
      },
      {
        title: "උපාය මාර්ගික සාමාජික කණ්ඩායම (21-25)",
        key: "strategicMembers",
        startRow: 21,
      },
    ];

    return (
      <div className="community-council-review">
        <h4 className="proposal-title">
          ප්‍රජා සංවර්ධන සභාව (Community Council)
        </h4>
        <table className="submission-data-table">
          <thead>
            <tr>
              <th>අංකය</th>
              <th>නම</th>
              <th>තනතුර</th>
              <th>දුරකතන අංකය</th>
              <th>විද්‍යුත් ලිපිනය</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => {
              // Fetch the correct array from the structured data
              const members = councilData[section.key] || [];

              // Only render a section/rows if it actually contains submitted members
              if (members.length === 0) return null;

              return (
                <React.Fragment key={section.key}>
                  <tr className="section-separator">
                    <td colSpan="5">
                      <strong>{section.title}</strong>
                    </td>
                  </tr>
                  {members.map((member, index) => {
                    // Calculate the correct sequential row number
                    const globalRowNumber = section.startRow + index;
                    return (
                      <tr key={section.key + globalRowNumber}>
                        <td>{globalRowNumber}</td>
                        <td>{member.name}</td>
                        <td>{member.position}</td>
                        <td>{member.phone}</td>
                        <td>{member.email}</td>
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

  const renderSubmissionData = (data) => {
    if (!data) return null;

    // Render Hybrid Table
    if (data.tableData?.fixed && data.tableData?.dynamic) {
      const columns = Object.keys(
        data.tableData.fixed[Object.keys(data.tableData.fixed)[0]] || {}
      );
      return (
        <table className="submission-data-table">
          <thead>
            <tr>
              <th>Category</th>
              {columns.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.tableData.fixed).map(([key, rowData]) => (
              <tr key={key}>
                <td>
                  <strong>{key.replace(/_/g, " ")}</strong>
                </td>
                {columns.map((header) => (
                  <td key={header}>{rowData[header]}</td>
                ))}
              </tr>
            ))}
            {data.tableData.dynamic
              .filter((row) => row.description)
              .map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.description}</strong>
                  </td>
                  {columns.map((header) => (
                    <td key={header}>{row[header]}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      );
    }

    // Render Simple Dynamic Table
    if (Array.isArray(data.tableData) && data.tableData.length > 0) {
      const headers = Object.keys(data.tableData[0]);
      return (
        <table className="submission-data-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.tableData.map((row, index) => (
              <tr key={index}>
                {headers.map((header) => (
                  <td key={header}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // Render simple key-value data ('problems')
    const problemEntries = Object.entries(data).filter(
      ([key]) => key !== "tableData" && key !== "secondaryTableData"
    );
    if (problemEntries.length > 0) {
      return (
        <div className="problem-entries">
          {problemEntries.map(([key, value]) => (
            <p key={key}>
              <strong>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                :{" "}
              </strong>
              {typeof value === "object"
                ? JSON.stringify(value)
                : value.toString()}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderProposals = (proposals) => {
    if (
      !proposals ||
      proposals.length === 0 ||
      (proposals.length === 1 && !proposals[0].proposal)
    ) {
      return null;
    }

    return (
      <>
        <h4 className="proposal-title">සංවර්ධන යෝජනා (Proposals)</h4>
        <table className="submission-data-table">
          <thead>
            <tr>
              <th>සංවර්ධන යෝජනාව</th>
              <th>ඇස්තමේන්තුව (රු.)</th>
              <th>වගකීම ආයතනය/නිලධාරියා</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((prop, index) => (
              <tr key={prop._id || index}>
                <td>{prop.proposal}</td>
                <td>{prop.cost}</td>
                <td>{prop.agency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  if (!isAuthenticated) return <div>Access Denied. Please log in.</div>;
  if (!isAdmin)
    return <div>Access Denied. Admin role required to view submissions.</div>;

  if (loading)
    return <div className="form-container">Loading submissions...</div>;
  if (error)
    return (
      <div className="form-container" style={{ color: "red" }}>
        Error: {error}
      </div>
    );

  return (
    <div className="submission-list-container">
      <FilterPanel />
      <h2>Filtered Submissions ({submissions.length})</h2>
      {submissions.length === 0 ? (
        <div className="submission-card">
          No submissions found matching the criteria.
        </div>
      ) : (
        submissions.map((submission) => (
          <div key={submission._id} className="submission-card">
            <h3>{submission.selection.sector}</h3>
            {submission.selection.subCategory && (
              <h4>{submission.selection.subCategory}</h4>
            )}

            <div className="location-details">
              <p>
                <strong>District:</strong> {submission.location.district}
              </p>
              <p>
                <strong>DS Division:</strong>{" "}
                {submission.location.divisionalSec}
              </p>
              <p>
                <strong>GN Division:</strong> {submission.location.gnDivision}
              </p>
              <p>
                <strong>Submitted:</strong>{" "}
                {new Date(submission.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* ⭐ RENDER THE NEW COUNCIL DATA HERE ⭐ */}
            {renderCommunityCouncil(submission.communityCouncil)}

            {renderSubmissionData(submission.data)}
            {renderProposals(submission.proposals)}
          </div>
        ))
      )}
    </div>
  );
};

export default SubmissionList;