import React from "react";

const DynamicContent = ({
  currentSection,
  problems,
  handleProblemChange,
  handleTextWithNumberChange,
  tableData,
  handleTableChange,
  handleHybridTableChange,
  addTableRow,
  deleteTableRow,
  addOtherRow,
  deleteOtherRow,
  secondaryTableData,
  addSecondaryTableRow,
  handleSecondaryTableChange,
}) => {

  const renderProblemInputs = () => {
    if (!currentSection || !currentSection.problems) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4 pb-2 border-b">ගැටළුව / අවශ්‍යතාවය</h3>
        {currentSection.problems.map((prob) => {
          switch (prob.type) {
            case "number":
              return (
                <div key={prob.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{prob.label}:</label>
                  <input
                    type="number"
                    value={problems[prob.id] || ""}
                    onChange={(e) => handleProblemChange(prob.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              );
            case "yesno":
              return (
                <div key={prob.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{prob.label}:</label>
                  <select
                    value={problems[prob.id] || ""}
                    onChange={(e) => handleProblemChange(prob.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">තෝරන්න</option>
                    <option value="yes">ඔව්</option>
                    <option value="no">නැත</option>
                  </select>
                </div>
              );
            case "select":
              return (
                <div key={prob.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{prob.label}:</label>
                  <select
                    value={problems[prob.id] || ""}
                    onChange={(e) => handleProblemChange(prob.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">තෝරන්න</option>
                    {prob.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              );
            case "text_with_number":
              return (
                <div key={prob.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{prob.label}:</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="විස්තරය"
                      value={problems[prob.id]?.text || ""}
                      onChange={(e) => handleTextWithNumberChange(prob.id, "text", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="සංඛ්‍යාව"
                      value={problems[prob.id]?.number || ""}
                      onChange={(e) => handleTextWithNumberChange(prob.id, "number", e.target.value)}
                      className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    );
  };

  const renderTable = () => {
    if (!currentSection || (!currentSection.isTable && !currentSection.isHybridTable)) {
      return null;
    }

    const tableInputClasses = "w-full p-1 border border-transparent rounded bg-transparent focus:outline-none focus:border-blue-500 focus:bg-white";

    if (currentSection.isHybridTable) {
      return (
        <div className="my-8">
          <h3 className="text-xl font-semibold mb-4 pb-2 border-b">දත්ත වගුව</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">{currentSection.fixedColumnHeader}</th>
                  {currentSection.tableColumns.map((col) => (<th className="p-3 text-left" key={col.header}>{col.header}</th>))}
                  {currentSection.dynamicRow && <th className="w-28"></th>}
                </tr>
              </thead>
              <tbody>
                {/* Main fixed rows */}
                {currentSection.mainRows?.map((row) => (
                  <tr key={row.id} className="border-b">
                    <td className="p-2 font-medium">{row.label}</td>
                    {currentSection.tableColumns.map((col) => (
                      <td key={col.header} className="p-2">
                        <input
                          type={col.type || "text"}
                          value={(tableData?.fixed?.[row.id]?.[col.header]) || ""}
                          onChange={(e) => handleHybridTableChange('fixed', row.id, col.header, e.target.value)}
                          className={tableInputClasses}
                        />
                      </td>
                    ))}
                    {currentSection.dynamicRow && <td></td>}
                  </tr>
                ))}
                {/* Dynamic "Other" rows */}
                {currentSection.dynamicRow && tableData?.dynamic?.map((row) => (
                  <tr key={row.id} className="border-b">
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder={currentSection.dynamicRow.placeholder}
                        value={row.description || ""}
                        onChange={(e) => handleHybridTableChange('dynamic', row.id, 'description', e.target.value)}
                        className={tableInputClasses}
                      />
                    </td>
                    {currentSection.tableColumns.map((col) => (
                      <td key={col.header} className="p-2">
                        <input
                          type={col.type || "text"}
                          value={row[col.header] || ""}
                          onChange={(e) => handleHybridTableChange('dynamic', row.id, col.header, e.target.value)}
                          className={tableInputClasses}
                        />
                      </td>
                    ))}
                    <td>
                      {tableData.dynamic.length > 1 && (
                        <button type="button" onClick={() => deleteOtherRow(row.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
                {/* Final fixed rows */}
                {currentSection.finalRows?.map((row) => (
                  <tr key={row.id} className="border-b">
                    <td className="p-2 font-medium">{row.label}</td>
                    {currentSection.tableColumns.map((col) => (
                      <td key={col.header} className="p-2">
                        <input
                          type={col.type || "text"}
                          value={(tableData?.fixed?.[row.id]?.[col.header]) || ""}
                          onChange={(e) => handleHybridTableChange('fixed', row.id, col.header, e.target.value)}
                          className={tableInputClasses}
                        />
                      </td>
                    ))}
                    {currentSection.dynamicRow && <td></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {currentSection.dynamicRow && (
            <button
              type="button"
              onClick={addOtherRow}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              වෙනත් ඇතුළත් කරන්න
            </button>
          )}
        </div>
      );
    }

    if (currentSection.isTable) {
      return (
        <div className="my-8">
          <h3 className="text-xl font-semibold mb-4 pb-2 border-b">දත්ත වගුව</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  {currentSection.tableColumns.map((col) => (<th className="p-3 text-left" key={col.header}>{col.header}</th>))}
                  {currentSection.canDeleteRows && <th className="w-28 p-3 text-left">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(tableData) && tableData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b">
                    {currentSection.tableColumns.map((col) => (
                      <td key={col.header} className="p-2">
                        <input
                          type={col.type || "text"}
                          value={row[col.header] === undefined ? "" : row[col.header]}
                          onChange={(e) => handleTableChange(rowIndex, col.header, e.target.value)}
                          className={tableInputClasses}
                        />
                      </td>
                    ))}
                    {currentSection.canDeleteRows && (
                      <td className="p-2">
                        <button type="button" onClick={() => deleteTableRow(rowIndex)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded">Delete</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={addTableRow}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            නව පේළියක් එකතු කරන්න
          </button>
        </div>
      );
    }
    return null;
  };

  const renderExtraFields = () => {
    if (!currentSection || !currentSection.extraFields) {
      return null;
    }

    return (
      <div className="mt-6 space-y-4">
        {currentSection.extraFields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}:</label>
            <input
              type={field.type}
              value={problems[field.id] || ""}
              onChange={(e) => handleProblemChange(field.id, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}
      </div>
    );
  };

  const renderSecondaryTable = () => {
    if (!currentSection?.secondaryTable) {
      return null;
    }
    const secondaryTableConfig = currentSection.secondaryTable;
    const tableInputClasses = "w-full p-1 border border-transparent rounded bg-transparent focus:outline-none focus:border-blue-500 focus:bg-white";

    return (
      <div className="mt-8 pt-6 border-t">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                {secondaryTableConfig.tableColumns.map((col) => (<th className="p-3 text-left" key={col.header}>{col.header}</th>))}
              </tr>
            </thead>
            <tbody>
              {secondaryTableData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b">
                  {secondaryTableConfig.tableColumns.map(col => (
                    <td key={col.header} className="p-2">
                      <input
                        type={col.type || "text"}
                        value={row[col.header] || ""}
                        onChange={(e) => handleSecondaryTableChange(rowIndex, col.header, e.target.value)}
                        className={tableInputClasses}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addSecondaryTableRow}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          නව පේළියක් එකතු කරන්න
        </button>
      </div>
    );
  };

  return (
    <>
      {renderProblemInputs()}
      {renderTable()}
      {renderExtraFields()}
      {renderSecondaryTable()}
    </>
  );
};

export default DynamicContent;