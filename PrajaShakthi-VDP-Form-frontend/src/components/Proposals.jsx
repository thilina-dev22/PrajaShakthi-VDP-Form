import React from "react";

const Proposals = ({
  proposals,
  handleProposalChange,
  addProposal,
  deleteProposal,
}) => {
  return (
    <div className="proposals-section">
      <h3 className="section-title">සංවර්ධන යෝජනා (ප්‍රමුඛතාව අනුව)</h3>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>අංකය</th>
              <th>සංවර්ධන යෝජනාව</th>
              <th>අපේක්ෂිත දළ ඇස්තමේන්තුව (රු.)</th>
              <th>වගකීම ආයතනය/නිලධාරියා</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((prop, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td>
                  <input
                    className="table-input"
                    value={prop.proposal}
                    onChange={(e) =>
                      handleProposalChange(index, "proposal", e.target.value)
                    }
                    placeholder="සංවර්ධන යෝජනාව"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="table-input"
                    value={prop.cost}
                    onChange={(e) =>
                      handleProposalChange(index, "cost", e.target.value)
                    }
                    placeholder="ඇස්තමේන්තුව (රු.)"
                  />
                </td>
                <td>
                  <input
                    className="table-input"
                    value={prop.agency}
                    onChange={(e) =>
                      handleProposalChange(index, "agency", e.target.value)
                    }
                    placeholder="වගකීම ආයතනය/නිලධාරියා"
                  />
                </td>
                <td className="text-center">
                  {proposals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteProposal(index)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addProposal}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        නව යෝජනාවක් එකතු කරන්න
      </button>
    </div>
  );
};

export default Proposals;
