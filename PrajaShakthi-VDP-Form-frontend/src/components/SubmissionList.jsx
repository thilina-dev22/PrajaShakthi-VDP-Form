import React, { useState, useEffect } from 'react';

const SubmissionList = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/submissions');
                if (!response.ok) {
                    throw new Error('Data could not be fetched!');
                }
                const data = await response.json();
                setSubmissions(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    // Helper function to render the main data object
    const renderSubmissionData = (data) => {
        if (!data) return null;

        // Render Hybrid Table
        if (data.tableData?.fixed && data.tableData?.dynamic) {
            const columns = Object.keys(data.tableData.fixed[Object.keys(data.tableData.fixed)[0]] || {});
            return (
                <table className="submission-data-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            {columns.map(header => <th key={header}>{header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(data.tableData.fixed).map(([key, rowData]) => (
                             <tr key={key}>
                                <td><strong>{key.replace(/_/g, ' ')}</strong></td>
                                {columns.map(header => <td key={header}>{rowData[header]}</td>)}
                            </tr>
                        ))}
                        {data.tableData.dynamic
                            .filter(row => row.description)
                            .map((row) => (
                            <tr key={row.id}>
                                <td><strong>{row.description}</strong></td>
                                {columns.map(header => <td key={header}>{row[header]}</td>)}
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
                            {headers.map(header => <th key={header}>{header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.tableData.map((row, index) => (
                            <tr key={index}>
                                {headers.map(header => <td key={header}>{row[header]}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
        
        // Render simple key-value data ('problems')
        const problemEntries = Object.entries(data).filter(([key]) => key !== 'tableData' && key !== 'secondaryTableData');
        if (problemEntries.length > 0) {
            return (
                 <div className="problem-entries">
                    {problemEntries.map(([key, value]) => (
                        <p key={key}>
                            <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: </strong> 
                            {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                        </p>
                    ))}
                </div>
            )
        }

        return null;
    };

    // --- NEW: Helper function to render the proposals table ---
    const renderProposals = (proposals) => {
        if (!proposals || proposals.length === 0 || (proposals.length === 1 && !proposals[0].proposal)) {
            return null; // Don't render if there are no proposals or if the first one is empty
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


    if (loading) return <div>Loading submissions...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="submission-list-container">
            <h2>All Submissions</h2>
            {submissions.map((submission) => (
                <div key={submission._id} className="submission-card">
                    <h3>{submission.selection.sector}</h3>
                    {submission.selection.subCategory && <h4>{submission.selection.subCategory}</h4>}
                    
                    <div className="location-details">
                        <p><strong>District:</strong> {submission.location.district}</p>
                        <p><strong>DS Division:</strong> {submission.location.divisionalSec}</p>
                        <p><strong>GN Division:</strong> {submission.location.gnDivision}</p>
                        <p><strong>Submitted:</strong> {new Date(submission.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    {/* Render the main data and proposals */}
                    {renderSubmissionData(submission.data)}
                    {renderProposals(submission.proposals)}

                </div>
            ))}
        </div>
    );
};

export default SubmissionList;