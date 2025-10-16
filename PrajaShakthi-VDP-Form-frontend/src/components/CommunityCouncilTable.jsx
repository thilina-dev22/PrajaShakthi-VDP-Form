import React from "react";

const CommunityCouncilTable = ({ data, onChange }) => {
  const sections = [
    {
      title: "කාරක සභා සාමාජිකයින් / குழு உறுப்பினர்கள் / Team members",
      start: 0,
      end: 5,
      maxRows: 5,
    },
    {
      title: "ප්‍රජා නියෝජිත කණ්ඩායම / சமூகப் பிரதிநிதி குழு / Community Representative Committee",
      start: 5,
      end: 20,
      maxRows: 15,
    },
    {
      title: "උපාය මාර්ගික සාමාජික කණ්ඩායම / மூலோபாய உறுப்பினர் குழு / Strategic Membership Committee",
      start: 20,
      end: 25,
      maxRows: 5,
    },
  ];

  // A consistent style for all input fields within the table
  const inputClasses = "w-full p-1 border border-transparent rounded bg-transparent focus:outline-none focus:border-blue-500 focus:bg-white";

  const renderTableRows = (section) => {
    const sectionData = data.slice(section.start, section.end);
    const rowsToRender = [];

    sectionData.forEach((row, localIndex) => {
      const globalIndex = section.start + localIndex;
      const requiresContact =
        (row.name && row.name.trim() !== "") ||
        (row.position && row.position.trim() !== "") ||
        (row.email && row.email.trim() !== "");

      rowsToRender.push(
        <tr key={globalIndex} className="border-b hover:bg-gray-50">
          <td className="p-2 text-center align-top">{globalIndex + 1}</td>
          <td className="p-2">
            <input
              type="text"
              value={row.name}
              onChange={(e) => onChange(globalIndex, "name", e.target.value)}
              className={inputClasses}
            />
          </td>
          <td className="p-2">
            <input
              type="text"
              value={row.position}
              onChange={(e) =>
                onChange(globalIndex, "position", e.target.value)
              }
              className={inputClasses}
            />
          </td>
          <td className="p-2">
            <input
              type="text"
              value={row.phone}
              onChange={(e) => onChange(globalIndex, "phone", e.target.value)}
              className={inputClasses}
              required={requiresContact}
            />
          </td>
          <td className="p-2">
            <input
              type="text"
              value={row.whatsapp}
              onChange={(e) =>
                onChange(globalIndex, "whatsapp", e.target.value)
              }
              className={inputClasses}
              required={requiresContact}
            />
          </td>
          <td className="p-2">
            <input
              type="email"
              value={row.email}
              onChange={(e) => onChange(globalIndex, "email", e.target.value)}
              className={inputClasses}
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
          <td colSpan="6" className="bg-blue-100 text-blue-800 font-bold p-3 text-center">
            {section.title}
          </td>
        </tr>
        {renderTableRows(section)}
      </React.Fragment>
    );
  };

  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-4 pb-2 border-b">
        ප්‍රජා සංවර්ධන සභාව (Community Development Council)
      </h3>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[5%]">
                අංකය
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[17%]">
                නම
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[17%]">
                තනතුර
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[17%]">
                දුරකතන අංකය
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[17%]">
                වට්ස් ඇප් අංකය
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[27%]">
                විද්‍යුත් ලිපිනය
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sections.map(renderSection)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommunityCouncilTable;