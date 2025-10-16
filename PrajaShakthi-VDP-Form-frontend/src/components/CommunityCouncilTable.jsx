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

  // FIXED: Changed to use a distinct border and background for better visibility.
  const inputClasses = "w-full px-1 py-1 border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500";
  
  // ADDED: Phone regex pattern for client-side hint
  // SL mobile number format: 07(0-8)xxxxxxx (10 digits total)
  const phonePattern = "07[01245678][0-9]{7}"; 
  const phoneTitle = "ශ්‍රී ලංකාවේ 10-අංක ජංගම දුරකථන අංක ආකෘතිය (උදා: 0712345678)";

  // ADDED: Reusable indicator for conditionally required fields
  const RequiredIndicator = () => (
    <span className="text-red-500 font-bold text-lg leading-none align-text-top" title="අවශ්‍ය ක්ෂේත්‍රය (Required Field)">*</span>
  );

  const renderTableRows = (section) => {
    const sectionData = data.slice(section.start, section.end);
    const rowsToRender = [];

    sectionData.forEach((row, localIndex) => {
      const globalIndex = section.start + localIndex;

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
          {/* UPDATED: Added pattern and title attributes */}
          <td className="p-2">
            <input
              type="text"
              value={row.phone}
              onChange={(e) => onChange(globalIndex, "phone", e.target.value)}
              className={inputClasses}
              pattern={phonePattern} 
              title={phoneTitle}      
            />
          </td>
          {/* UPDATED: Added pattern and title attributes */}
          <td className="p-2">
            <input
              type="text"
              value={row.whatsapp}
              onChange={(e) =>
                onChange(globalIndex, "whatsapp", e.target.value)
              }
              className={inputClasses}
              pattern={phonePattern} 
              title={phoneTitle}      
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
                නම <RequiredIndicator />
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[17%]">
                තනතුර <RequiredIndicator />
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[17%]">
                දුරකතන අංකය <RequiredIndicator />
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[17%]">
                වට්ස් ඇප් අංකය <RequiredIndicator />
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[27%]">
                විද්‍යුත් ලිපිනය <RequiredIndicator />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sections.map(renderSection)}
          </tbody>
        </table>
        {/* ADDED: Indicator note for the conditional required fields */}
        <div className="p-2 text-sm text-gray-600 bg-gray-50 border-t">
          <RequiredIndicator /> **All fields are conditionally required (if data is entered in any row, all columns in that row must be filled). Rows must be filled sequentially.
          <br/>සියලුම ක්ෂේත්‍ර කොන්දේසි සහිතව අවශ්‍ය වේ** (යම් පේළියක දත්ත ඇතුලත් කරන්නේ නම් එහි සියලුම තීරු පිරවිය යුතුය). පේළි පිළිවෙලින් පිරවිය යුතුය.
        </div>
      </div>
    </div>
  );
};

export default CommunityCouncilTable;