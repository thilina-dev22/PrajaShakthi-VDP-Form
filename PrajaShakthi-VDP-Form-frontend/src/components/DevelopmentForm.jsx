import React, { useState, useEffect } from "react";
import provincialDataJson from "../data/provincial_data.json";
// Import the new components
import LocationSelector from "./DevelopmentFormLocation";
import DynamicContent from "./DynamicContent";
import Proposals from "./Proposals";
// eslint-disable-next-line no-unused-vars
import { submitForm } from "../api/auth"; // MODIFIED: Import submitForm
import { sectors } from "../data/sectors_data.js"; // Import the sectors object

import DevelopmentFormLocation from "./DevelopmentFormLocation"; // <-- ADD THIS
import SectorSelector from "./SectorSelector";

// Initial state structures for the new Community Council Table
const emptyCouncilRow = { name: "", position: "", phone: "", email: "" };
const MAX_ROWS = 25;

// Initialize all 25 slots as empty. We will control rendering to show only 1 in each section by default.
// The indices (0 to 24) correspond to the row numbers (1 to 25).
const initialCommunityCouncilData = Array(MAX_ROWS)
  .fill(null)
  .map((_, index) => ({
    ...emptyCouncilRow,
    // Mark the first row of each section as visible/initialized by default for cleaner UI
    isVisible: index === 0 || index === 5 || index === 20,
  }));

const DevelopmentForm = () => {
  // State for form inputs and selections
  const [district, setDistrict] = useState("");
  const [divisionalSec, setDivisionalSec] = useState("");
  const [gnDivision, setGnDivision] = useState("");
  const [cdcVdpId, setCdcVdpId] = useState("");
  const [sector, setSector] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");
  const [subSubSubCategory, setSubSubSubCategory] = useState("");

  const [districts, setDistricts] = useState([]);
  const [dsDivisions, setDsDivisions] = useState([]);
  const [gnDivisions, setGnDivisions] = useState([]);

  const [problems, setProblems] = useState({});
  const [tableData, setTableData] = useState([null]);
  const [proposals, setProposals] = useState([
    { proposal: "", cost: "", agency: "" },
  ]);

  const [secondaryTableData, setSecondaryTableData] = useState([]);

  // ⭐ NEW STATE FOR THE COMMUNITY COUNCIL TABLE ⭐
  const [communityCouncilData, setCommunityCouncilData] = useState(
    initialCommunityCouncilData
  );

  // Load initial district data from the imported JSON
  useEffect(() => {
    const allDistricts = provincialDataJson[0]?.districts || [];
    setDistricts(allDistricts);
  }, []);

  // Event handlers for cascading dropdowns
  const handleDistrictChange = (e) => {
    const selectedDistrictName = e.target.value;
    setDistrict(selectedDistrictName);
    setDivisionalSec("");
    setGnDivision("");
    setDsDivisions([]);
    setGnDivisions([]);

    if (selectedDistrictName) {
      const selectedDistrictData = districts.find(
        (d) => d.district.trim() === selectedDistrictName
      );
      if (selectedDistrictData) {
        setDsDivisions(selectedDistrictData.ds_divisions);
      }
    }
  };

  const handleDivisionalSecChange = (e) => {
    const selectedDsName = e.target.value;
    setDivisionalSec(selectedDsName);
    setGnDivision("");
    setGnDivisions([]);

    if (selectedDsName) {
      const selectedDsData = dsDivisions.find(
        (ds) => ds.ds_division_name.trim() === selectedDsName
      );
      if (selectedDsData) {
        setGnDivisions(selectedDsData.gn_divisions);
      }
    }
  };

  const getFinalSection = () => {
    if (!sector || !subCategory) return null;
    try {
      const level1 = sectors[sector];
      const level2 = level1 ? level1[subCategory] : null;
      if (
        !level2 ||
        level2.problems ||
        level2.isTable ||
        level2.isFixedRowTable ||
        level2.isHybridTable
      )
        return level2;
      if (!subSubCategory) return null;
      const level3 = level2[subSubCategory];
      if (
        !level3 ||
        level3.problems ||
        level3.isTable ||
        level3.isFixedRowTable ||
        level3.isHybridTable
      )
        return level3;
      if (!subSubSubCategory) return null;
      const level4 = level3[subSubSubCategory];
      return level4 || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const currentSection = getFinalSection();

  useEffect(
    () => {
      if (currentSection) {
        if (currentSection.isTable) {
          setTableData([]);
        } else if (currentSection.isHybridTable) {
          const initialFixedData = {};
          // Combine mainRows and finalRows for state initialization
          const allFixedRows = [
            ...(currentSection.mainRows || []),
            ...(currentSection.finalRows || []),
          ];
          allFixedRows.forEach((row) => {
            initialFixedData[row.id] = {};
            currentSection.tableColumns.forEach((col) => {
              initialFixedData[row.id][col] = "";
            });
          });

          // Conditionally create the dynamic part
          const dynamicPart = currentSection.dynamicRow
            ? [
                {
                  id: `${currentSection.dynamicRow.idPrefix}_${Date.now()}`,
                  description: "",
                  ...currentSection.tableColumns.reduce(
                    (acc, col) => ({ ...acc, [col]: "" }),
                    {}
                  ),
                },
              ]
            : [];
          setTableData({ fixed: initialFixedData, dynamic: dynamicPart });
        }
        // Handle secondary table initialization
        if (currentSection.secondaryTable) {
          setSecondaryTableData([]);
        }
      } else {
        setTableData(null);
        setSecondaryTableData([]); // Also clear on deselect
      }
    },
    // End of useEffect function
    // The dependency array should be inside useEffect
    // Move the closing parenthesis after the dependency array
    [currentSection]
  );

  // ⭐ CORRECTED/UPDATED HANDLERS FOR THE COMMUNITY COUNCIL TABLE ⭐

  const getSectionInfo = (globalIndex) => {
    // Returns index info based on global index (0-24)
    if (globalIndex >= 0 && globalIndex < 5)
      return { start: 0, end: 5, maxRows: 5, minRows: 1 };
    if (globalIndex >= 5 && globalIndex < 20)
      return { start: 5, end: 20, maxRows: 15, minRows: 1 };
    if (globalIndex >= 20 && globalIndex < 25)
      return { start: 20, end: 25, maxRows: 5, minRows: 1 };
    return null;
  };

  const handleCouncilRowChange = (index, field, value) => {
    setCommunityCouncilData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });
  };

  const addCouncilRow = (startIndex, maxCount) => {
    setCommunityCouncilData((prev) => {
      const newData = [...prev];
      let firstEmptyIndex = -1;

      // Find the first *non-visible* slot within the section's range (startIndex to startIndex + maxCount)
      for (let i = startIndex; i < startIndex + maxCount; i++) {
        if (!newData[i].isVisible) {
          firstEmptyIndex = i;
          break;
        }
      }

      if (firstEmptyIndex !== -1) {
        // Activate the next hidden slot
        newData[firstEmptyIndex] = { ...emptyCouncilRow, isVisible: true };
        return newData;
      }
      return prev; // Section is full
    });
  };

  const deleteCouncilRow = (globalIndex) => {
    setCommunityCouncilData((prev) => {
      const section = getSectionInfo(globalIndex);
      if (!section) return prev;

      // 1. Check minimum visibility constraint
      const sectionVisibleCount = prev
        .slice(section.start, section.end)
        .filter((row) => row.isVisible).length;

      if (sectionVisibleCount <= section.minRows) {
        alert("At least one row must remain in each section.");
        return prev;
      }

      // 2. Create the new state array
      const newData = prev.map((row, index) => {
        if (index === globalIndex) {
          // This is the row to be effectively deleted (cleared and hidden)
          return { ...emptyCouncilRow, isVisible: false };
        }
        return row;
      });

      // 3. Re-order/Compaction Logic for the specific section
      const sectionData = newData.slice(section.start, section.end);

      // Separate visible rows from hidden slots
      const visibleRows = sectionData.filter((row) => row.isVisible);
      const hiddenRows = sectionData.filter((row) => !row.isVisible);

      // Combine: all visible rows first, then all hidden slots
      const reorderedSection = [...visibleRows, ...hiddenRows];

      // 4. Splice the reordered data back into the main array
      // We ensure we only take the exact number of slots for this section (maxRows)
      newData.splice(
        section.start,
        section.maxRows,
        ...reorderedSection.slice(0, section.maxRows)
      );

      return newData;
    });
  };
  const isSectionFull = (startIndex, maxCount) => {
    return communityCouncilData
      .slice(startIndex, startIndex + maxCount)
      .every((row) => row.isVisible);
  };

  const resetSelections = (level) => {
    if (level <= 1) setSubCategory("");
    if (level <= 2) setSubSubCategory("");
    if (level <= 3) setSubSubSubCategory("");
    setProblems({});
    setTableData([]);
  };

  const handleProblemChange = (id, value) => {
    setProblems((prev) => ({ ...prev, [id]: value }));
  };

  const handleTextWithNumberChange = (id, field, value) => {
    setProblems((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const deleteTableRow = (rowIndex) => {
    setTableData((prev) => prev.filter((_, index) => index !== rowIndex));
  };

  const addSecondaryTableRow = () => {
    if (!currentSection?.secondaryTable) return;
    const newRow = currentSection.secondaryTable.tableColumns.reduce(
      (acc, col) => ({ ...acc, [col]: "" }),
      {}
    );
    setSecondaryTableData((prev) => [...prev, newRow]);
  };

  const handleSecondaryTableChange = (rowIndex, col, value) => {
    setSecondaryTableData((prev) => {
      const newData = [...prev];
      newData[rowIndex][col] = value;
      return newData;
    });
  };

  const addTableRow = () => {
    if (!currentSection || !currentSection.tableColumns) return;
    const newRow = currentSection.tableColumns.reduce(
      (acc, col) => ({ ...acc, [col]: "" }),
      {}
    );
    setTableData((prev) => [...prev, newRow]);
  };

  const handleTableChange = (rowIndex, col, value) => {
    setTableData((prev) => {
      const newData = [...prev];
      newData[rowIndex][col] = value;
      return newData;
    });
  };

  const handleHybridTableChange = (type, id, column, value) => {
    setTableData((prev) => {
      const newData = { ...prev };
      if (type === "fixed") {
        newData.fixed[id] = { ...newData.fixed[id], [column]: value };
      } else if (type === "dynamic") {
        const rowIndex = newData.dynamic.findIndex((row) => row.id === id);
        if (rowIndex > -1) {
          const newDynamicRows = [...newData.dynamic];
          newDynamicRows[rowIndex] = {
            ...newDynamicRows[rowIndex],
            [column]: value,
          };
          newData.dynamic = newDynamicRows;
        }
      }
      return newData;
    });
  };

  const addOtherRow = () => {
    const newRow = {
      id: `${currentSection.dynamicRow.idPrefix}_${Date.now()}`,
      description: "",
    };
    currentSection.tableColumns.forEach((col) => {
      newRow[col] = "";
    });
    setTableData((prev) => ({
      ...prev,
      dynamic: [...prev.dynamic, newRow],
    }));
  };

  const deleteOtherRow = (id) => {
    setTableData((prev) => ({
      ...prev,
      dynamic: prev.dynamic.filter((row) => row.id !== id),
    }));
  };

  const addProposal = () => {
    setProposals((prev) => [...prev, { proposal: "", cost: "", agency: "" }]);
  };

  const handleProposalChange = (index, field, value) => {
    setProposals((prev) => {
      const newProposals = [...prev];
      newProposals[index][field] = value;
      return newProposals;
    });
  };

  const deleteProposal = (index) => {
    setProposals((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const collectedData = {
      ...problems,
    };

    if (currentSection?.isTable || currentSection?.isHybridTable) {
      collectedData.tableData = tableData;
    }

    if (currentSection?.secondaryTable) {
      collectedData.secondaryTableData = secondaryTableData;
    }

    // Helper function to check if a row has any data (as used before)
    const hasData = (row) =>
      row.name.trim() !== "" ||
      row.position.trim() !== "" ||
      row.phone.trim() !== "" ||
      row.email.trim() !== "";

    // ⭐ CRITICAL FIX: Group data into three sections for submission ⭐
    const councilData = {
      // Kāraka Sabhā Sāmājikayin (Rows 1-5 / Indices 0-4)
      committeeMembers: communityCouncilData.slice(0, 5).filter(hasData),

      // Prajā Niyōjita Kaṇḍāyama (Rows 6-20 / Indices 5-19)
      communityReps: communityCouncilData.slice(5, 20).filter(hasData),

      // Upāya Mārgika Sāmājika Kaṇḍāyama (Rows 21-25 / Indices 20-24)
      strategicMembers: communityCouncilData.slice(20, 25).filter(hasData),
    };

    const formData = {
      location: {
        district,
        divisionalSec,
        gnDivision,
        cdcVdpId,
      },
      // Send the structured object instead of the single flat array
      communityCouncil: councilData,

      selection: {
        sector,
        subCategory,
        subSubCategory,
        subSubSubCategory,
      },
      data: collectedData,
      proposals,
    };
    // ⭐ END CRITICAL FIX ⭐

    try {
      console.log("Form Submitted Data:", JSON.stringify(formData, null, 2));

      // The actual submission code (uncomment when ready to test live)
      // eslint-disable-next-line no-unused-vars
      const result = await submitForm(formData); // <--- THIS LINE IS UNCOMMENTED

      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error submitting form: ${error.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">ඒකාබද්ධ ග්‍රාම සංවර්ධන සැලැස්ම</h2>
      <form onSubmit={handleSubmit}>
        <LocationSelector
          district={district}
          divisionalSec={divisionalSec}
          gnDivision={gnDivision}
          cdcVdpId={cdcVdpId}
          districts={districts}
          dsDivisions={dsDivisions}
          gnDivisions={gnDivisions}
          handleDistrictChange={handleDistrictChange}
          handleDivisionalSecChange={handleDivisionalSecChange}
          setGnDivision={setGnDivision}
          setCdcVdpId={setCdcVdpId}
          communityCouncilData={communityCouncilData}
          handleCouncilRowChange={handleCouncilRowChange}
          addCouncilRow={addCouncilRow}
          deleteCouncilRow={deleteCouncilRow} // Pass new delete handler
          isSectionFull={isSectionFull}
        />

        <SectorSelector
          sectors={sectors}
          sector={sector}
          setSector={setSector}
          subCategory={subCategory}
          setSubCategory={setSubCategory}
          subSubCategory={subSubCategory}
          setSubSubCategory={setSubSubCategory}
          subSubSubCategory={subSubSubCategory}
          setSubSubSubCategory={setSubSubSubCategory}
          resetSelections={resetSelections}
        />

        <DynamicContent
          currentSection={currentSection}
          problems={problems}
          handleProblemChange={handleProblemChange}
          handleTextWithNumberChange={handleTextWithNumberChange}
          tableData={tableData}
          handleTableChange={handleTableChange}
          handleHybridTableChange={handleHybridTableChange}
          addTableRow={addTableRow}
          deleteTableRow={deleteTableRow}
          addOtherRow={addOtherRow}
          deleteOtherRow={deleteOtherRow}
          // Add new props for the secondary table
          secondaryTableData={secondaryTableData}
          addSecondaryTableRow={addSecondaryTableRow}
          handleSecondaryTableChange={handleSecondaryTableChange}
        />

        <Proposals
          proposals={proposals}
          handleProposalChange={handleProposalChange}
          addProposal={addProposal}
          deleteProposal={deleteProposal}
        />

        <button type="submit" className="btn btn-primary btn-submit">
          ඉදිරිපත් කරන්න
        </button>
      </form>
    </div>
  );
};

export default DevelopmentForm;
