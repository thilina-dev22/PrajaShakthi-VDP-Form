import React from "react";

const Proposals = ({
  proposals,
  handleProposalChange,
  addProposal,
  deleteProposal,
}) => {
  return (
    <div className="my-8 sm:my-10">
      <h3 className="text-gray-800 mb-4 pb-2 border-b-2 border-gray-200 text-lg sm:text-xl font-semibold">සංවර්ධන යෝජනා (ප්‍රමුඛතාව අනුව)</h3>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          <table className="min-w-full border-collapse mb-5">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 py-3 sm:px-3 sm:py-3 align-middle bg-gray-100 font-semibold text-left text-sm sm:text-base">අංකය</th>
                <th className="border border-gray-300 px-2 py-3 sm:px-3 sm:py-3 align-middle bg-gray-100 font-semibold text-left text-sm sm:text-base">සංවර්ධන යෝජනාව</th>
                <th className="border border-gray-300 px-2 py-3 sm:px-3 sm:py-3 align-middle bg-gray-100 font-semibold text-left text-sm sm:text-base">අපේක්ෂිත දළ ඇස්තමේන්තුව (රු.)</th>
                <th className="border border-gray-300 px-2 py-3 sm:px-3 sm:py-3 align-middle bg-gray-100 font-semibold text-left text-sm sm:text-base">වගකීම ආයතනය/නිලධාරියා</th>
                <th className="border border-gray-300 px-2 py-3 sm:px-3 sm:py-3 align-middle bg-gray-100 font-semibold text-left text-sm sm:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((prop, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-2 sm:px-3 sm:py-3 align-middle text-center text-sm sm:text-base">{index + 1}</td>
                  <td className="border border-gray-300 px-2 py-2 sm:px-3 sm:py-3 align-middle">
                    <input
                      className="w-full px-2 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
                      value={prop.proposal}
                      onChange={(e) =>
                        handleProposalChange(index, "proposal", e.target.value)
                      }
                      placeholder="සංවර්ධන යෝජනාව"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2 sm:px-3 sm:py-3 align-middle">
                    <input
                      type="number"
                      className="w-full px-2 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
                      value={prop.cost}
                      onChange={(e) =>
                        handleProposalChange(index, "cost", e.target.value)
                      }
                      placeholder="ඇස්තමේන්තුව (රු.)"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2 sm:px-3 sm:py-3 align-middle">
                    <input
                      className="w-full px-2 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
                      value={prop.agency}
                      onChange={(e) =>
                        handleProposalChange(index, "agency", e.target.value)
                      }
                      placeholder="වගකීම ආයතනය/නිලධාරියා"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2 sm:px-3 sm:py-3 align-middle text-center">
                    {proposals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteProposal(index)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded text-sm font-medium transition-all duration-200 active:translate-y-0.5"
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
      </div>
      <button
        type="button"
        onClick={addProposal}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 sm:py-2.5 sm:px-5 rounded mt-2 transition-all duration-200 w-full sm:w-auto"
      >
        නව යෝජනාවක් එකතු කරන්න
      </button>
    </div>
  );
};

export default Proposals;
