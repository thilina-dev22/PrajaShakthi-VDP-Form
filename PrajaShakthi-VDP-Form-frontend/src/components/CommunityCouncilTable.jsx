import React from "react";
import { useTranslation } from 'react-i18next';

const CommunityCouncilTable = ({ data, onChange }) => {
  const { t } = useTranslation();

  // Fixed positions for first 4 rows
  const fixedPositions = [
    { value: t('council.positionPresident'), label: t('council.positionPresident') },
    { value: t('council.positionSecretary'), label: t('council.positionSecretary') },
    { value: t('council.positionGN'), label: t('council.positionGN') },
    { value: t('council.positionSamurdhi'), label: t('council.positionSamurdhi') },
  ];

  // Dropdown options for row 5 only
  const row5PositionOptions = [
    { value: "", label: t('council.selectPosition') },
    { value: t('council.positionAgri'), label: t('council.positionAgri') },
    { value: t('council.positionFisheries'), label: t('council.positionFisheries') },
    { value: t('council.positionAquaculture'), label: t('council.positionAquaculture') },
    { value: t('council.positionOther'), label: t('council.positionOther') }
  ];

  // Gender options
  const genderOptions = [
    { value: "", label: "Select Gender / ස්ත්‍රී පුරුෂ භාවය තෝරන්න" },
    { value: "Male", label: "Male / පුරුෂ" },
    { value: "Female", label: "Female / ස්ත්‍රී" },
    { value: "Other", label: "Other / වෙනත්" }
  ];

  const sectionsTable1 = [
    {
      start: 0,
      end: 5,
      maxRows: 5,
    },
  ];

  const sectionsTable2 = [
    {
      start: 5,
      end: 20,
      maxRows: 15,
    },
  ];

  const sectionsTable3 = [
    {
      start: 20,
      end: 25,
      maxRows: 5,
    },
  ];

  // FIXED: Changed to use a distinct border and background for better visibility.
  const inputClasses =
    "w-full px-1 py-1 border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500";

  // ADDED: Phone regex pattern for client-side hint
  // SL mobile number format: 07(0-8)xxxxxxx (10 digits total)
  const phonePattern = "07[01245678][0-9]{7}";
  const phoneTitle =
    "ශ්‍රී ලංකාවේ 10-අංක ජංගම දුරකථන අංක ආකෘතිය (උදා: 0712345678)";

  // ADDED: Reusable indicator for conditionally required fields
  const RequiredIndicator = () => (
    <span
      className="text-red-500 font-bold text-lg leading-none align-text-top"
      title="අවශ්‍ය ක්ෂේත්‍රය (Required Field)"
    >
      *
    </span>
  );

  // Check if row 5 position value is custom (not in dropdown)
  const isRow5CustomPosition = (row) => {
    const otherLabel = t('council.positionOther');
    return row.position && !row5PositionOptions.some(opt => opt.value === row.position && opt.value !== otherLabel);
  };

  // Render rows for Table 1 (rows 1-5) with position column
  const renderTable1Rows = (section) => {
    const sectionData = data.slice(section.start, section.end);
    const rowsToRender = [];
    const otherLabel = t('council.positionOther');

    sectionData.forEach((row, localIndex) => {
      const globalIndex = section.start + localIndex;
      
      // Rows 1-4 (index 0-3) have fixed positions, Row 5 (index 4) has dropdown
      const isFixedPosition = globalIndex < 4;
      const isRow5 = globalIndex === 4;
      
      const showCustomInput = isRow5 && (row.position === otherLabel || isRow5CustomPosition(row));
      const dropdownValue = isRow5 && isRow5CustomPosition(row) && row.position !== otherLabel ? otherLabel : row.position;

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
            {isFixedPosition ? (
              // Rows 1-4: Display fixed position (read-only)
              <div className="px-2 py-1 bg-gray-100 border rounded">
                {fixedPositions[globalIndex].label}
              </div>
            ) : isRow5 ? (
              // Row 5: Dropdown with remaining positions
              showCustomInput ? (
                <div className="space-y-1">
                  <select
                    value={otherLabel}
                    onChange={(e) => {
                      if (e.target.value !== otherLabel) {
                        onChange(globalIndex, "position", e.target.value);
                      }
                    }}
                    className={inputClasses}
                  >
                    {row5PositionOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={row.position === otherLabel ? "" : row.position}
                    onChange={(e) => onChange(globalIndex, "position", e.target.value)}
                    placeholder={t('council.enterPosition')}
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
                  {row5PositionOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )
            ) : null}
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
              type="text"
              value={row.nic}
              onChange={(e) => onChange(globalIndex, "nic", e.target.value)}
              className={inputClasses}
              placeholder="NIC / ජාතික හැඳුනුම්පත"
            />
          </td>
          <td className="p-2">
            <select
              value={row.gender}
              onChange={(e) => onChange(globalIndex, "gender", e.target.value)}
              className={inputClasses}
            >
              {genderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </td>
          <td className="p-2">
            <textarea
              value={row.permanentAddress}
              onChange={(e) => onChange(globalIndex, "permanentAddress", e.target.value)}
              className={inputClasses}
              placeholder="Permanent Address / ස්ථිර ලිපිනය"
              rows="2"
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
              type="text"
              value={row.nic}
              onChange={(e) => onChange(globalIndex, "nic", e.target.value)}
              className={inputClasses}
              placeholder="NIC / ජාතික හැඳුනුම්පත"
            />
          </td>
          <td className="p-2">
            <select
              value={row.gender}
              onChange={(e) => onChange(globalIndex, "gender", e.target.value)}
              className={inputClasses}
            >
              {genderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </td>
          <td className="p-2">
            <textarea
              value={row.permanentAddress}
              onChange={(e) => onChange(globalIndex, "permanentAddress", e.target.value)}
              className={inputClasses}
              placeholder="Permanent Address / ස්ථිර ලිපිනය"
              rows="2"
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
          <td
            colSpan="8"
            className="bg-blue-100 text-blue-800 font-bold p-3 text-center"
          >
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
          <td
            colSpan="7"
            className="bg-blue-100 text-blue-800 font-bold p-3 text-center"
          >
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
          {t('council.committeeMembers')}
        </h3>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[5%]">
                  {t('council.rowNumber')}
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                  {t('form.name')} <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                  {t('form.position')} <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[12%]">
                  {t('form.phone')} <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[12%]">
                  {t('form.whatsapp')} <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[13%]">
                  NIC / හැඳුනුම්පත <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]">
                  Gender / ස්ත්‍රී පුරුෂ භාවය <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[18%]">
                  Permanent Address / ස්ථිර ලිපිනය <RequiredIndicator />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sectionsTable1.map(renderTable1Section)}
            </tbody>
          </table>
          <div className="p-2 text-sm text-gray-600 bg-gray-50 border-t">
            <RequiredIndicator /> {t('council.requiredNote')}
          </div>
        </div>
      </div>

      {/* TABLE 2: Rows 6-20 WITHOUT Position Column */}
      <div>
        <h3 className="text-xl font-semibold mb-4 pb-2 border-b">
          {t('council.communityReps')}
        </h3>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[5%]">
                  {t('council.rowNumber')}
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
                  {t('form.name')} <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                  {t('form.phone')} <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                  {t('form.whatsapp')} <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                  NIC / හැඳුනුම්පත <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[12%]">
                  Gender / ස්ත්‍රී පුරුෂ භාවය <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[18%]">
                  Permanent Address / ස්ථිර ලිපිනය <RequiredIndicator />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sectionsTable2.map(renderTable2Section)}
            </tbody>
          </table>
          <div className="p-2 text-sm text-gray-600 bg-gray-50 border-t">
            <RequiredIndicator /> {t('council.requiredNote')}
          </div>
        </div>
      </div>

      {/* TABLE 3: Rows 21-25 WITHOUT Position Column */}
      <div>
        <h3 className="text-xl font-semibold mb-4 pb-2 border-b">
          {t('council.strategicMembers')}
        </h3>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[5%]">
                  {t('council.rowNumber')}
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
                  {t('form.name')} <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                  {t('form.phone')} <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                  {t('form.whatsapp')} <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                  NIC / හැඳුනුම්පත <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[12%]">
                  Gender / ස්ත්‍රී පුරුෂ භාවය <RequiredIndicator />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[18%]">
                  Permanent Address / ස්ථිර ලිපිනය <RequiredIndicator />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sectionsTable3.map(renderTable2Section)}
            </tbody>
          </table>
          <div className="p-2 text-sm text-gray-600 bg-gray-50 border-t">
            <RequiredIndicator /> {t('council.requiredNote')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityCouncilTable;
