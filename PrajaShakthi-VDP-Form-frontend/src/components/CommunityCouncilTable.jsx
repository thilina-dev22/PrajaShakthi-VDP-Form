import React from "react";

const CommunityCouncilTable = ({
  data,
  onChange,
  onAddRow,
  deleteCouncilRow,
}) => {
  const sections = [
    {
      title: "කාරක සභා සාමාජිකයින්", // Committee Members
      start: 0,
      end: 5,
      maxRows: 5,
    },
    {
      title: "ප්‍රජා නියෝජිත කණ්ඩායම", // Community Representative Group
      start: 5,
      end: 20,
      maxRows: 15,
    },
    {
      title: "උපාය මාර්ගික සාමාජික කණ්ඩායම", // Strategic Member Group
      start: 20,
      end: 25,
      maxRows: 5,
    },
  ];

  const renderTableRows = (section) => {
    // We iterate over the *full* slice of data for the section to determine the global index
    const sectionData = data.slice(section.start, section.end);

    const rowsToRender = [];

    sectionData.forEach((row, localIndex) => {
      if (!row.isVisible) return; // Skip non-visible rows

      // The key fix: Calculate the global index directly from the section's start and local index.
      const globalIndex = section.start + localIndex;

      // Count how many visible rows are in the current section
      const sectionVisibleCount = sectionData.filter((r) => r.isVisible).length;
      // Delete is disabled if this is the only visible row (count <= 1)

      rowsToRender.push(
        <tr key={globalIndex}>
          <td>{globalIndex + 1}</td>{" "}
          <td>
            <input
              type="text"
              value={row.name}
              onChange={(e) => onChange(globalIndex, "name", e.target.value)}
              className="table-input"
            />
          </td>
          <td>
            <input
              type="text"
              value={row.position}
              onChange={(e) =>
                onChange(globalIndex, "position", e.target.value)
              }
              className="table-input"
            />
          </td>
          <td>
            <input
              type="text"
              value={row.phone}
              onChange={(e) => onChange(globalIndex, "phone", e.target.value)}
              className="table-input"
            />
          </td>
          <td>
            <input
              type="email"
              value={row.email}
              onChange={(e) => onChange(globalIndex, "email", e.target.value)}
              className="table-input"
            />
          </td>
          <td style={{ textAlign: "center" }}>
            {/* ⭐ NEW CONDITIONAL RENDERING LOGIC ⭐ */}
            {sectionVisibleCount > 1 && (
              <button
                type="button"
                onClick={() => deleteCouncilRow(globalIndex)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            )}
          </td>
        </tr>
      );
    });

    return rowsToRender;
  };

  const renderSection = (section) => {
    // Check how many visible rows are in the section
    const currentVisibleCount = data
      .slice(section.start, section.end)
      .filter((row) => row.isVisible).length;

    return (
      <React.Fragment key={section.title}>
        <tr>
          <td colSpan="6" className="section-header-row">
            {section.title}
          </td>
        </tr>
        {renderTableRows(section)}

        {/* Add Row Button */}
        <tr>
          <td colSpan="6" style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={() => onAddRow(section.start, section.maxRows)}
              className="btn btn-sm btn-info"
              disabled={currentVisibleCount >= section.maxRows}
            >
              {currentVisibleCount >= section.maxRows
                ? `Maximum ${section.maxRows} Rows Added`
                : `නව සාමාජිකයෙක් එකතු කරන්න (${currentVisibleCount}/${section.maxRows})`}
            </button>
          </td>
        </tr>
      </React.Fragment>
    );
  };

  return (
    <div className="table-section" style={{ marginTop: "30px" }}>
      <h3 className="section-title">
        ප්‍රජා සංවර්ධන සභාව (Community Development Council)
      </h3>
      <div className="table-responsive">
        <table className="data-table community-council-table">
          <thead>
            <tr>
              <th style={{ width: "5%" }}>අංකය</th>
              <th style={{ width: "20%" }}>නම</th>
              <th style={{ width: "20%" }}>තනතුර (ඇත්නම්)</th>
              <th style={{ width: "20%" }}>දුරකතන අංකය</th>
              <th style={{ width: "25%" }}>විද්‍යුත් ලිපිනය</th>
              <th style={{ width: "10%" }}>Action</th>
            </tr>
          </thead>
          <tbody>{sections.map(renderSection)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default CommunityCouncilTable;
