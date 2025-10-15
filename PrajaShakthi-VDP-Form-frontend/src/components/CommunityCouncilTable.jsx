import React from "react";

// 1. REMOVED 'onAddRow' from props
const CommunityCouncilTable = ({ data, onChange }) => {
  const sections = [
    {
      title: "කාරක සභා සාමාජිකයින් / குழு உறுப்பினர்கள் / Team members ", // Committee Members
      start: 0,
      end: 5,
      maxRows: 5,
    },
    {
      title:
        "ප්‍රජා නියෝජිත කණ්ඩායම / சமூகப் பிரதிநிதி குழு / Community Representative Committee ", // Community Representative Group
      start: 5,
      end: 20,
      maxRows: 15,
    },
    {
      title:
        "උපාය මාර්ගික සාමාජික කණ්ඩායම / மூலோபாய உறுப்பினர் குழு / Strategic Membership Committee ", // Strategic Member Group
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
      // *** REMOVED: The visibility check 'if (!row.isVisible) return;' ***
      // This ensures all 25 data slots are rendered, regardless of their isVisible flag.

      const globalIndex = section.start + localIndex;

      // New Conditional Logic: Check if Name, Position, OR Email is filled for this row
      const requiresContact =
        (row.name && row.name.trim() !== "") ||
        (row.position && row.position.trim() !== "") ||
        (row.email && row.email.trim() !== "");

      rowsToRender.push(
        <tr key={globalIndex}>
          {/* අංකය */}
          <td>{globalIndex + 1}</td>

          {/* නම (Optional) */}
          <td>
            <input
              type="text"
              value={row.name}
              onChange={(e) => onChange(globalIndex, "name", e.target.value)}
              className="table-input"
            />
          </td>

          {/* තනතුර (ඇත්නම්) (Optional) */}
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

          {/* දුරකතන අංකය (REQUIRED only if requiresContact is true) */}
          <td>
            <input
              type="text"
              value={row.phone}
              onChange={(e) => onChange(globalIndex, "phone", e.target.value)}
              className="table-input"
              required={requiresContact} // <--- CONDITIONAL REQUIREMENT APPLIED
            />
          </td>

          {/* Whatsapp අංකය (REQUIRED only if requiresContact is true) */}
          <td>
            <input
              type="text"
              value={row.whatsapp}
              onChange={(e) =>
                onChange(globalIndex, "whatsapp", e.target.value)
              }
              className="table-input"
              required={requiresContact} // <--- CONDITIONAL REQUIREMENT APPLIED
            />
          </td>

          {/* විද්‍යුත් ලිපිනය (Optional) */}
          <td>
            <input
              type="email"
              value={row.email}
              onChange={(e) => onChange(globalIndex, "email", e.target.value)}
              className="table-input"
            />
          </td>
        </tr>
      );
    });

    return rowsToRender;
  };

  const renderSection = (section) => {
    return (
      <React.Fragment key={section.title}>
        <tr>
          <td colSpan="6" className="section-header-row">
            {section.title}
          </td>
        </tr>
        {renderTableRows(section)}
        {/* Removed: Add Row Button section */}
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
              <th style={{ width: "5%" }}>අංකය / இல்லை / No </th>
              <th style={{ width: "17%" }}>නම / பெயர்/ Name </th>
              <th style={{ width: "17%" }}>තනතුර / நிலை / Status</th>
              <th style={{ width: "17%" }}>
                දුරකතන අංකය / தொலைபேசி எண் / Telephone no
              </th>
              <th style={{ width: "17%" }}>
                වට්ස් ඇප් අංකය / வாட்ஸ்அப் / Whatsapp no{" "}
              </th>
              <th style={{ width: "25%" }}>
                විද්‍යුත් ලිපිනය / மின்னஞ்சல் முகவரி / Email{" "}
              </th>
            </tr>
          </thead>
          <tbody>{sections.map(renderSection)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default CommunityCouncilTable;
