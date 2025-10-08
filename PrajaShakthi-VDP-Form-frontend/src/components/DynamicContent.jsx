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
            <div className="problem-section">
                <h3 className="section-title">ගැටළුව / අවශ්‍යතාවය</h3>
                {currentSection.problems.map((prob) => {
                    switch (prob.type) {
                        case "number":
                            return (
                                <div key={prob.id} className="form-group">
                                    <label className="form-label">{prob.label}:</label>
                                    <input
                                        type="number"
                                        value={problems[prob.id] || ""}
                                        onChange={(e) => handleProblemChange(prob.id, e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                            );
                        case "yesno":
                            return (
                                <div key={prob.id} className="form-group">
                                    <label className="form-label">{prob.label}:</label>
                                    <select
                                        value={problems[prob.id] || ""}
                                        onChange={(e) => handleProblemChange(prob.id, e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="">තෝරන්න</option>
                                        <option value="yes">ඔව්</option>
                                        <option value="no">නැත</option>
                                    </select>
                                </div>
                            );
                        case "select":
                            return (
                                <div key={prob.id} className="form-group">
                                    <label className="form-label">{prob.label}:</label>
                                    <select
                                        value={problems[prob.id] || ""}
                                        onChange={(e) => handleProblemChange(prob.id, e.target.value)}
                                        className="form-control"
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
                                <div key={prob.id} className="form-group">
                                    <label className="form-label">{prob.label}:</label>
                                    <div className="d-flex">
                                        <input
                                            type="text"
                                            placeholder="විස්තරය"
                                            value={problems[prob.id]?.text || ""}
                                            onChange={(e) => handleTextWithNumberChange(prob.id, "text", e.target.value)}
                                            className="form-control"
                                        />
                                        <input
                                            type="number"
                                            placeholder="සංඛ්‍යාව"
                                            value={problems[prob.id]?.number || ""}
                                            onChange={(e) => handleTextWithNumberChange(prob.id, "number", e.target.value)}
                                            className="form-control"
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

        if (currentSection.isHybridTable) {
            return (
                <div className="table-section">
                    <h3 className="section-title">දත්ත වගුව</h3>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>{currentSection.fixedColumnHeader}</th>
                                    {currentSection.tableColumns.map((col) => (<th key={col.header}>{col.header}</th>))}
                                    {currentSection.dynamicRow && <th style={{ width: '120px' }}></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Render the main fixed rows */}
                                {currentSection.mainRows && currentSection.mainRows.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.label}</td>
                                        {currentSection.tableColumns.map((col) => (
                                            <td key={col.header}>
                                                <input
                                                    type={col.type || "text"}
                                                    value={(tableData?.fixed?.[row.id]?.[col.header]) || ""}
                                                    onChange={(e) => handleHybridTableChange('fixed', row.id, col.header, e.target.value)}
                                                    className="table-input"
                                                />
                                            </td>
                                        ))}
                                        {currentSection.dynamicRow && <td></td>}
                                    </tr>
                                ))}

                                {/* Conditionally Render the dynamic "Other" rows */}
                                {currentSection.dynamicRow && tableData?.dynamic?.map((row) => (
                                    <tr key={row.id}>
                                        <td>
                                            <input
                                                type="text" // Description is always text
                                                placeholder={currentSection.dynamicRow.placeholder}
                                                value={row.description || ""}
                                                onChange={(e) => handleHybridTableChange('dynamic', row.id, 'description', e.target.value)}
                                                className="table-input"
                                            />
                                        </td>
                                        {currentSection.tableColumns.map((col) => (
                                            <td key={col.header}>
                                                <input
                                                    type={col.type || "text"}
                                                    value={row[col.header] || ""}
                                                    onChange={(e) => handleHybridTableChange('dynamic', row.id, col.header, e.target.value)}
                                                    className="table-input"
                                                />
                                            </td>
                                        ))}
                                        <td>
                                            {tableData.dynamic.length > 1 && (
                                                <button type="button" onClick={() => deleteOtherRow(row.id)} className="btn btn-danger">Delete</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {/* Conditionally render the final fixed rows */}
                                {currentSection.finalRows && currentSection.finalRows.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.label}</td>
                                        {currentSection.tableColumns.map((col) => (
                                            <td key={col.header}>
                                                <input
                                                    type={col.type || "text"}
                                                    value={(tableData?.fixed?.[row.id]?.[col.header]) || ""}
                                                    onChange={(e) => handleHybridTableChange('fixed', row.id, col.header, e.target.value)}
                                                    className="table-input"
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
                        <button type="button" onClick={addOtherRow} className="btn btn-secondary" style={{ marginTop: '10px' }}>Add Other Row</button>
                    )}
                </div>
            );
        }

        if (currentSection.isTable) {
            return (
                <div className="table-section">
                    <h3 className="section-title">දත්ත වගුව</h3>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {currentSection.tableColumns.map((col) => (<th key={col.header}>{col.header}</th>))}
                                    {currentSection.canDeleteRows && <th style={{ width: '120px' }}>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(tableData) && tableData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {currentSection.tableColumns.map((col) => (
                                            <td key={col.header}>
                                                <input
                                                    type={col.type || "text"}
                                                    value={row[col.header] === undefined ? "" : row[col.header]}
                                                    onChange={(e) => handleTableChange(rowIndex, col.header, e.target.value)}
                                                    className="table-input"
                                                />
                                            </td>
                                        ))}
                                        {currentSection.canDeleteRows && (
                                            <td>
                                                <button type="button" onClick={() => deleteTableRow(rowIndex)} className="btn btn-danger">Delete</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button type="button" onClick={addTableRow} className="btn btn-secondary" style={{ marginTop: '10px' }}>නව පේළියක් එකතු කරන්න</button>
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
            <div className="extra-fields-section" style={{ marginTop: '20px' }}>
                {currentSection.extraFields.map((field) => (
                    <div key={field.id} className="form-group">
                        <label className="form-label">{field.label}:</label>
                        <input
                            type={field.type}
                            value={problems[field.id] || ""}
                            onChange={(e) => handleProblemChange(field.id, e.target.value)}
                            className="form-control"
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
        return (
            <div className="table-section" style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                {secondaryTableConfig.tableColumns.map((col) => (<th key={col.header}>{col.header}</th>))}
                            </tr>
                        </thead>
                        <tbody>
                            {secondaryTableData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {secondaryTableConfig.tableColumns.map(col => (
                                        <td key={col.header}>
                                            <input
                                                type={col.type || "text"}
                                                value={row[col.header] || ""}
                                                onChange={(e) => handleSecondaryTableChange(rowIndex, col.header, e.target.value)}
                                                className="table-input"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button type="button" onClick={addSecondaryTableRow} className="btn btn-secondary" style={{ marginTop: '10px' }}>නව පේළියක් එකතු කරන්න</button>
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