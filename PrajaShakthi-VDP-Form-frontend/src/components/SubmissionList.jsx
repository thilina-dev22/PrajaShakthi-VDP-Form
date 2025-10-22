import React, { useState, useEffect } from "react";
import { getSubmissions, deleteSubmission } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import provincialDataJson from "../data/provincial_data.json";
// Import sectors for label lookup
import { sectors } from "../data/sectors_data";
// REMOVED: import "./AdminTabs.css"; since custom CSS was removed

const SubmissionList = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("council_info"); // 'council_info' or 'main_form'

  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterDsDivision, setFilterDsDivision] = useState("");
  const [filterGnDivision, setFilterGnDivision] = useState("");

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
      const selectedDistrictData = districts.find(
        (d) => d.district.trim() === filterDistrict
      );
      if (selectedDistrictData)
        setDsDivisions(selectedDistrictData.ds_divisions);
    }
  }, [filterDistrict, districts]);

  useEffect(() => {
    setGnDivisions([]);
    if (filterDsDivision) {
      const selectedDsData = dsDivisions.find(
        (ds) => ds.ds_division_name.trim() === filterDsDivision
      );
      if (selectedDsData) setGnDivisions(selectedDsData.gn_divisions);
    }
  }, [filterDsDivision, dsDivisions]);

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
  }, [
    isAuthenticated,
    isAdmin,
    filterDistrict,
    filterDsDivision,
    filterGnDivision,
    activeTab,
  ]);

  const FilterPanel = () => (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg mb-5">
      <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
        Filter Submissions
      </h3>
      <div className="flex flex-col md:flex-row gap-5">
        {/* District Dropdown */}
        <div className="flex-1">
          <label className="block mb-2 font-medium text-gray-700 text-base">
            District:
          </label>
          <select
            value={filterDistrict}
            onChange={(e) => {
              setFilterDistrict(e.target.value);
              setFilterDsDivision("");
              setFilterGnDivision("");
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">-- All Districts --</option>
            {districts.map((d) => (
              <option key={d.district.trim()} value={d.district.trim()}>
                {d.district.trim()}
              </option>
            ))}
          </select>
        </div>
        {/* DS Division Dropdown */}
        <div className="flex-1">
          <label className="block mb-2 font-medium text-gray-700 text-base">
            DS Division:
          </label>
          <select
            value={filterDsDivision}
            onChange={(e) => {
              setFilterDsDivision(e.target.value);
              setFilterGnDivision("");
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
        {/* GN Division Dropdown */}
        <div className="flex-1">
          <label className="block mb-2 font-medium text-gray-700 text-base">
            GN Division:
          </label>
          <select
            value={filterGnDivision}
            onChange={(e) => setFilterGnDivision(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this submission? This action cannot be undone."
      )
    ) {
      try {
        await deleteSubmission(id);
        setSubmissions((currentSubmissions) =>
          currentSubmissions.filter((sub) => sub._id !== id)
        );
        alert("Submission deleted successfully!");
      } catch (err) {
        setError(err.message);
        alert(`Error deleting submission: ${err.message}`);
      }
    }
  };

  const renderCommunityCouncil = (councilData) => {
    if (
      !councilData ||
      typeof councilData !== "object" ||
      (!councilData.committeeMembers?.length &&
        !councilData.communityReps?.length &&
        !councilData.strategicMembers?.length)
    ) {
      return (
        <p className="text-gray-500 italic">
          No council information submitted.
        </p>
      );
    }
    const sections = [
      {
        title: "කාරක සභා සාමාජිකයින් (1-5)",
        key: "committeeMembers",
        startRow: 1,
        showPosition: true,
      },
      {
        title: "ප්‍රජා නියෝජිත කණ්ඩායම (6-20)",
        key: "communityReps",
        startRow: 6,
        showPosition: false,
      },
      {
        title: "උපාය මාර්ගික සාමාජික කණ්ඩායම (21-25)",
        key: "strategicMembers",
        startRow: 21,
        showPosition: false,
      },
    ];
    return (
      <div className="mt-4">
        <h4 className="text-lg font-semibold mt-6 pb-2 border-b border-gray-300">
          Community Development Council
        </h4>
        {sections.map((section) => (
          <div key={section.key} className="overflow-x-auto mt-6">
            <h5 className="text-md font-semibold mb-2 text-[#A8234A]">
              {section.title}
            </h5>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left font-bold w-12">#</th>
                  <th className="border border-gray-300 p-2 text-left font-bold">Name</th>
                  {section.showPosition && (
                    <th className="border border-gray-300 p-2 text-left font-bold">Position</th>
                  )}
                  <th className="border border-gray-300 p-2 text-left font-bold">Phone</th>
                  <th className="border border-gray-300 p-2 text-left font-bold">WhatsApp</th>
                  <th className="border border-gray-300 p-2 text-left font-bold">Email</th>
                </tr>
              </thead>
              <tbody>
                {section.key &&
                  councilData[section.key]?.map((member, index) => {
                    const globalRowNumber = section.startRow + index;
                    return (
                      <tr
                        key={`${section.key}-${globalRowNumber}`}
                        className="even:bg-gray-50"
                      >
                        <td className="border border-gray-300 p-2 font-semibold">{globalRowNumber}</td>
                        <td className="border border-gray-300 p-2">{member.name}</td>
                        {section.showPosition && (
                          <td className="border border-gray-300 p-2">{member.position}</td>
                        )}
                        <td className="border border-gray-300 p-2">{member.phone}</td>
                        <td className="border border-gray-300 p-2">{member.whatsapp}</td>
                        <td className="border border-gray-300 p-2">{member.email}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }; // Helper function to retrieve the deep section data
  const getDeepSection = (selection) => {
    const { sector, subCategory, subSubCategory, subSubSubCategory } = selection;
    if (!sector || !subCategory || !sectors[sector]) return null;

    let current = sectors[sector];

    // Check all up to 3 levels deep
    for (const key of [subCategory, subSubCategory, subSubSubCategory]) {
      if (!key) break;

      const nextLevel = current[key];
      if (!nextLevel) return null;

      // If the next level is the final section (has problems/tables), return it
      if (nextLevel.problems || nextLevel.isTable || nextLevel.isFixedRowTable || nextLevel.isHybridTable) {
        return nextLevel;
      }

      // If it's a nested selector, continue down
      current = nextLevel;
    }
    return null;
  };

  // Helper to render dynamic/fixed tables (reused from previous fix)
  const renderDynamicTable = (tableData, tableConfig, title) => {
    if (!tableConfig) return null;

    let rowsToRender = [];
    const columns = tableConfig.tableColumns || [];
    const fixedRows = tableData.fixed ? Object.entries(tableData.fixed) : [];
    const dynamicRows = tableData.dynamic || tableData;

    // Handling Hybrid/Fixed Table Data
    if (fixedRows.length > 0) {
      const fixedRowLabels = [...(tableConfig.mainRows || []), ...(tableConfig.finalRows || [])].reduce((acc, r) => {
        acc[r.id] = r.label;
        return acc;
      }, {});

      rowsToRender.push(
        ...fixedRows.map(([id, rowData]) => {
          const row = {
            [tableConfig.fixedColumnHeader || 'Label']: fixedRowLabels[id] || id,
          };
          // Only add columns that are defined in tableConfig
          columns.forEach(col => {
            row[col.header] = rowData[col.header];
          });
          return row;
        })
      );
    }

    // Handling Dynamic Table Data
    if (Array.isArray(dynamicRows)) {
      dynamicRows.forEach(dynamicRow => {
        // Only include rows that have some data
        const hasData = Object.values(dynamicRow).some(v => v !== "" && v !== undefined && v !== null);
        if (hasData) {
          const row = {};

          // Add the fixed column (description) if it exists
          if (tableConfig.fixedColumnHeader && dynamicRow.description !== undefined) {
            row[tableConfig.fixedColumnHeader] = dynamicRow.description;
          }

          // Only add columns that are defined in tableConfig
          columns.forEach(col => {
            row[col.header] = dynamicRow[col.header];
          });

          rowsToRender.push(row);
        }
      });
    }

    if (rowsToRender.length === 0) return null;

    // Build the final column list for rendering
    const displayColumns = [];
    if (tableConfig.fixedColumnHeader && rowsToRender.some(row => row[tableConfig.fixedColumnHeader] !== undefined)) {
      displayColumns.push({ header: tableConfig.fixedColumnHeader });
    }
    displayColumns.push(...columns);

    // Use a different structure for rendering the dynamic table, ensuring no hydration errors
    return (
      <div className="mt-8 pt-4 border-t border-gray-200">
        <h5 className="text-base font-semibold mb-3 text-gray-700">{title}</h5>
        <div className="overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                {displayColumns.map((col, i) => (
                  <th key={i} className="border border-gray-300 p-2 text-left font-bold">{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowsToRender.map((row, rowIndex) => (
                <tr key={rowIndex} className="even:bg-gray-50 border-b border-gray-200">
                  {displayColumns.map((col, colIndex) => (
                    <td key={colIndex} className="border border-gray-300 p-2 text-sm">
                      {row[col.header] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // MODIFIED: Renders the Main Form Data content with a clean look
  const renderMainFormData = (submission) => {
    const { sector, subCategory } = submission.selection || {};
    const currentSection = getDeepSection(submission.selection || {});

    // Fallback dictionary for simple problems data
    let problemLabels = {};
    if (currentSection && currentSection.problems) {
      problemLabels = currentSection.problems.reduce((acc, p) => {
        acc[p.id] = p.label;
        return acc;
      }, {});
    }

    return (
      <div className="mt-4">
        {/* Sector and Sub-Category Display */}
        <h4 className="text-lg font-semibold text-gray-800 mb-1">
          {sector || "No Sector Selected"}
        </h4>
        <p className="mb-4 text-gray-600 border-b pb-3 text-sm">
          <strong className="font-medium">Sub-Category:</strong>
          {subCategory || "N/A"}
        </p>

        {submission.data && Object.keys(submission.data).length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold pb-2 border-b border-gray-300">Data Inputs (දත්ත ඇතුළත් කිරීම්)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4 text-sm">
              {Object.entries(submission.data).map(([key, value]) => {
                // Skip table keys here, handled separately
                if (key === 'tableData' || key === 'secondaryTableData') {
                  return null;
                }

                const label = problemLabels[key] || key;
                let displayValue = "";

                if (typeof value === 'object' && value !== null) {
                  // Handles 'text_with_number' type
                  displayValue = `(${value.number || '0'}) - ${value.text || 'N/A'}`;
                } else {
                  displayValue = value;
                }

                // Only render non-empty data points (except when the value is explicitly 0)
                if (displayValue === "0" || displayValue.toString().trim() !== "") {
                  return (
                    <div key={key} className="flex flex-col p-3 bg-white rounded-md border border-gray-200">
                      <strong className="text-gray-600 font-medium leading-tight">{label}:</strong>
                      <span className="text-gray-800 font-bold mt-1">{displayValue}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Render dynamic/hybrid table data */}
            {currentSection && submission.data.tableData && renderDynamicTable(
              submission.data.tableData,
              currentSection,
              (currentSection.isHybridTable ? 'Fixed & Dynamic Table Data' : 'Table Data') + ' (වගු දත්ත)'
            )}

            {/* Render secondary table data */}
            {currentSection?.secondaryTable && submission.data.secondaryTableData && renderDynamicTable(
              submission.data.secondaryTableData,
              currentSection.secondaryTable,
              'Secondary Table Data (අතිරේක වගු දත්ත)'
            )}

          </div>
        )}

        {!submission.data || Object.keys(submission.data).length === 0 ? (
          <p className="text-gray-500 italic">
            No additional data for this submission.
          </p>
        ) : null}

        {renderProposals(submission.proposals)}
      </div>
    );
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
        <h4 className="text-lg font-semibold mt-8 pb-2 border-b border-gray-300">
          Proposals
        </h4>
        <div className="overflow-x-auto rounded-lg border border-gray-300 mt-4">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-300 p-2 text-left font-bold">
                  Proposal
                </th>
                <th className="border border-gray-300 p-2 text-left font-bold w-32">
                  Cost (Rs.)
                </th>
                <th className="border border-gray-300 p-2 text-left font-bold w-40">
                  Agency/Officer
                </th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((prop, index) => (
                <tr key={prop._id || index} className="even:bg-gray-50">
                  <td className="border border-gray-300 p-2">
                    {prop.proposal || '—'}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {prop.cost || '—'}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {prop.agency || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  if (!isAuthenticated) return <div>Access Denied. Please log in.</div>;
  if (!isAdmin) return <div>Access Denied. Admin role required.</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <FilterPanel />

      <div className="flex space-x-2 border-b border-gray-300 mb-6">
        <button
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-150 ease-in-out ${activeTab === "council_info"
              ? "bg-white border-x border-t border-gray-300 text-[#A8234A] -mb-px" // Active style
              : "bg-gray-100 text-gray-600 hover:bg-gray-200" // Inactive style
            }`}
          onClick={() => setActiveTab("council_info")}
        >
          Council Info Data (ප්‍රජා සභා තොරතුරු)
        </button>
        {/* <button
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-150 ease-in-out ${activeTab === "main_form"
              ? "bg-white border-x border-t border-gray-300 text-[#A8234A] -mb-px" // Active style
              : "bg-gray-100 text-gray-600 hover:bg-gray-200" // Inactive style
            }`}
          onClick={() => setActiveTab("main_form")}
        >
          Main Form Data (සංවර්ධන සැලැස්ම)
        </button> */}
      </div>

      <h2 className="text-2xl font-bold mb-4">
        Filtered Submissions ({submissions.length})
      </h2>

      {loading && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          Loading...
        </div>
      )}
      {error && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 shadow-sm text-red-600">
          Error: {error}
        </div>
      )}

      {!loading && !error && submissions.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 shadow-sm text-gray-500 italic">
          No submissions found for this category.
        </div>
      )}

      {!loading &&
        !error &&
        submissions.map((submission) => (
          <div
            key={submission._id}
            className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 shadow-sm"
          >

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 bg-blue-50 p-4 rounded-md mb-4 text-sm">
              <p>
                <strong className="font-semibold">District:</strong>
                {submission.location.district}
              </p>
              <p>
                <strong className="font-semibold">DS Division:</strong>
                {submission.location.divisionalSec}
              </p>
              <p>
                <strong className="font-semibold">GN Division:</strong>
                {submission.location.gnDivision}
              </p>
              <p>
                <strong className="font-semibold">Submitted:</strong>
                {new Date(submission.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="p-2 text-right">
              <button
                onClick={() => handleDelete(submission._id)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-md px-3 py-1 text-sm transition duration-150 ease-in-out"
              >
                Delete
              </button>
            </div>

            {activeTab === "council_info" &&
              renderCommunityCouncil(submission.communityCouncil)}
            {activeTab === "main_form" && renderMainFormData(submission)}
          </div>
        ))}
    </div>
  );
};

export default SubmissionList;