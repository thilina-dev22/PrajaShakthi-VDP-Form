import React from "react";

const CommunityCouncilTable = ({ data, onChange }) => {
  // Position dropdown options
  const positionOptions = [
    { value: "", label: "තෝරන්න / Select" },
    { value: "සභාපති", label: "සභාපති" },
    { value: "ලේකම්", label: "ලේකම්" },
    { value: "ග්‍රාම නිලධාරි", label: "ග්‍රාම නිලධාරි" },
    { value: "සමෘද්ධි සංවර්ධන නිලධාරි", label: "සමෘද්ධි සංවර්ධන නිලධාරි" },
    { value: "කෘෂිකර්ම පර්යේෂණ නිෂ්පාදන සහකාර", label: "කෘෂිකර්ම පර්යේෂණ නිෂ්පාදන සහකාර" },
    { value: "ධීවර නිලධාරි", label: "ධීවර නිලධාරි" },
    { value: "මිරිදිය ධීවර වගා ව්‍යාප්ත නිලධාරි", label: "මිරිදිය ධීවර වගා ව්‍යාප්ත නිලධාරි" },
    { value: "වෙනත්", label: "වෙනත්" }
  ];

  const sectionsTable1 = [
    {
      
      start: 0,
      end: 5,
      maxRows: 5,
    }
  ];

  const sectionsTable2 = [
    {
      start: 5,
      end: 20,
      maxRows: 15,
    }
  ];

  const sectionsTable3 = [
    {

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

  // Check if "වෙනත්" is selected and position needs to be custom
  const isCustomPosition = (row) => {
    return row.position && !positionOptions.some(opt => opt.value === row.position && opt.value !== "වෙනත්");
  };

  // Render rows for Table 1 (rows 1-5) with position dropdown
  const renderTable1Rows = (section) => {
    const sectionData = data.slice(section.start, section.end);
    const rowsToRender = [];

    sectionData.forEach((row, localIndex) => {
      const globalIndex = section.start + localIndex;
      const showCustomInput = row.position === "වෙනත්" || isCustomPosition(row);
      const dropdownValue = isCustomPosition(row) && row.position !== "වෙනත්" ? "වෙනත්" : row.position;

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
            {showCustomInput ? (
              <div className="space-y-1">
                <select
                  value="වෙනත්"
                  onChange={(e) => {
                    if (e.target.value !== "වෙනත්") {
                      onChange(globalIndex, "position", e.target.value);
                    }
                  }}
                  className={inputClasses}
                >
                  {positionOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={row.position === "වෙනත්" ? "" : row.position}
                  onChange={(e) => onChange(globalIndex, "position", e.target.value)}
                  placeholder="තනතුර ඇතුලත් කරන්න"
                  className={inputClasses}
                />
              </div>
            ) : (
              <select
                value={dropdownValue}
                onChange={(e) => {
                  onChange(globalIndex, "position", e.target.value);
                }}
                className={inputClasses}
              >
                {positionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </td>
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

  // Render rows for Table 2 (rows 6-25) WITHOUT position column
  const renderTable2Rows = (section) => {
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
              value={row.phone}
              onChange={(e) => onChange(globalIndex, "phone", e.target.value)}
              className={inputClasses}
              pattern={phonePattern} 
              title={phoneTitle}      
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

  const renderTable1Section = (section) => {
    return (
      <React.Fragment key={section.title}>
        <tr>
          <td colSpan="6" className="bg-blue-100 text-blue-800 font-bold p-3 text-center">
            {section.title}
          </td>
        </tr>
        {renderTable1Rows(section)}
      </React.Fragment>
    );
  };

  const renderTable2Section = (section) => {
    return (
      <React.Fragment key={section.title}>
        <tr>
          <td colSpan="5" className="bg-blue-100 text-blue-800 font-bold p-3 text-center">
            {section.title}
          </td>
        </tr>
        {renderTable2Rows(section)}
      </React.Fragment>
    );
  };

  return (
    <div className="my-8 space-y-8">
      {/* TABLE 1: Rows 1-5 with Position Column */}
      <div>
        <h3 className="text-xl font-semibold mb-4 pb-2 border-b">
          කාරක සභා සාමාජිකයින් / குழு உறுப்பினர்கள் 
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
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                  දුරකතන අංකය <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                  වට්ස් ඇප් අංකය <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[31%]">
                  විද්‍යුත් ලිපිනය <RequiredIndicator />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sectionsTable1.map(renderTable1Section)}
            </tbody>
          </table>
          <div className="p-2 text-sm text-gray-600 bg-gray-50 border-t">
            <RequiredIndicator /> **All fields are conditionally required (if data is entered in any row, all columns in that row must be filled). Rows must be filled sequentially.
            <br/>සියලුම ක්ෂේත්‍ර කොන්දේසි සහිතව අවශ්‍ය වේ** (යම් පේළියක දත්ත ඇතුලත් කරන්නේ නම් එහි සියලුම තීරු පිරවිය යුතුය). පේළි පිළිවෙලින් පිරවිය යුතුය.
          </div>
        </div>
      </div>

      {/* TABLE 2: Rows 6-20 WITHOUT Position Column */}
      <div>
        <h3 className="text-xl font-semibold mb-4 pb-2 border-b">
          ප්‍රජා නියෝජිත කණ්ඩායම / சமூகப் பிரதிநிதி குழு 
        </h3>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[5%]">
                  අංකය
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[25%]">
                  නම <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
                  දුරකතන අංකය <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
                  වට්ස් ඇප් අංකය <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[30%]">
                  විද්‍යුත් ලිපිනය <RequiredIndicator />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sectionsTable2.map(renderTable2Section)}
            </tbody>
          </table>
          <div className="p-2 text-sm text-gray-600 bg-gray-50 border-t">
            <RequiredIndicator /> **All fields are conditionally required (if data is entered in any row, all columns in that row must be filled). Rows must be filled sequentially.
            <br/>සියලුම ක්ෂේත්‍ර කොන්දේසි සහිතව අවශ්‍ය වේ** (යම් පේළියක දත්ත ඇතුලත් කරන්නේ නම් එහි සියලුම තීරු පිරවිය යුතුය). පේළි පිළිවෙලින් පිරවිය යුතුය.
          </div>
        </div>
      </div>

      {/* TABLE 3: Rows 21-25 WITHOUT Position Column */}
      <div>
        <h3 className="text-xl font-semibold mb-4 pb-2 border-b">
          උපාය මාර්ගික සාමාජික කණ්ඩායම / மூலோபாய உறுப்பினர் குழு        </h3>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[5%]">
                  අංකය
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[25%]">
                  නම <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
                  දුරකතන අංකය <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
                  වට්ස් ඇප් අංකය <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[30%]">
                  විද්‍යුත් ලිපිනය <RequiredIndicator />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sectionsTable3.map(renderTable2Section)}
            </tbody>
          </table>
          <div className="p-2 text-sm text-gray-600 bg-gray-50 border-t">
            <RequiredIndicator /> **All fields are conditionally required (if data is entered in any row, all columns in that row must be filled). Rows must be filled sequentially.
            <br/>සියලුම ක්ෂේත්‍ර කොන්දේසි සහිතව අවශ්‍ය වේ** (යම් පේළියක දත්ත ඇතුලත් කරන්නේ නම් එහි සියලුම තීරු පිරවිය යුතුය). පේළි පිළිවෙලින් පිරවිය යුතුය.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityCouncilTable;