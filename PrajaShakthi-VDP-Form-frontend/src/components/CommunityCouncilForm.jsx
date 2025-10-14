import React, { useState, useEffect } from "react";
import provincialDataJson from "../data/provincial_data.json";
import LocationSelectorBase from "./LocationSelectorBase"; // New Base component
import CommunityCouncilTable from "./CommunityCouncilTable";
// eslint-disable-next-line no-unused-vars
import { submitForm } from "../api/auth";

// Initial state structures for the Community Council Table
const emptyCouncilRow = { name: "", position: "", phone: "", email: "" };
const MAX_ROWS = 25;

// Initialize all 25 slots for three sections (5 + 15 + 5)
const initialCommunityCouncilData = Array(MAX_ROWS)
  .fill(null)
  .map((_, index) => ({
    ...emptyCouncilRow,
    // Mark the first row of each section as visible/initialized by default
    isVisible: index === 0 || index === 5 || index === 20,
  }));

const CommunityCouncilForm = () => {
  // State for form inputs and selections
  const [district, setDistrict] = useState("");
  const [divisionalSec, setDivisionalSec] = useState("");
  const [gnDivision, setGnDivision] = useState("");
  const [cdcVdpId, setCdcVdpId] = useState("");

  const [districts, setDistricts] = useState([]);
  const [dsDivisions, setDsDivisions] = useState([]);
  const [gnDivisions, setGnDivisions] = useState([]);

  const [communityCouncilData, setCommunityCouncilData] = useState(
    initialCommunityCouncilData
  );

  // Load initial district data from the imported JSON
  useEffect(() => {
    const allDistricts = provincialDataJson[0]?.districts || [];
    setDistricts(allDistricts);
  }, []);

  // Event handlers for cascading dropdowns (Copied from DevelopmentForm)
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
  
  // --- Community Council Table Handlers (Copied from DevelopmentForm) ---
  const emptyCouncilRow = { name: "", position: "", phone: "", email: "" };

  const getSectionInfo = (globalIndex) => {
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

      for (let i = startIndex; i < startIndex + maxCount; i++) {
        if (!newData[i].isVisible) {
          firstEmptyIndex = i;
          break;
        }
      }

      if (firstEmptyIndex !== -1) {
        newData[firstEmptyIndex] = { ...emptyCouncilRow, isVisible: true };
        return newData;
      }
      return prev;
    });
  };

  const deleteCouncilRow = (globalIndex) => {
    setCommunityCouncilData((prev) => {
      const section = getSectionInfo(globalIndex);
      if (!section) return prev;

      const sectionVisibleCount = prev
        .slice(section.start, section.end)
        .filter((row) => row.isVisible).length;

      if (sectionVisibleCount <= section.minRows) {
        alert("At least one row must remain in each section.");
        return prev;
      }

      const newData = prev.map((row, index) => {
        if (index === globalIndex) {
          return { ...emptyCouncilRow, isVisible: false };
        }
        return row;
      });

      const sectionData = newData.slice(section.start, section.end);
      const visibleRows = sectionData.filter((row) => row.isVisible);
      const hiddenRows = sectionData.filter((row) => !row.isVisible);
      const reorderedSection = [...visibleRows, ...hiddenRows];

      newData.splice(
        section.start,
        section.maxRows,
        ...reorderedSection.slice(0, section.maxRows)
      );

      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasData = (row) =>
      row.name.trim() !== "" ||
      row.position.trim() !== "" ||
      row.phone.trim() !== "" ||
      row.email.trim() !== "";

    const councilData = {
      committeeMembers: communityCouncilData.slice(0, 5).filter(hasData),
      communityReps: communityCouncilData.slice(5, 20).filter(hasData),
      strategicMembers: communityCouncilData.slice(20, 25).filter(hasData),
    };

    // Prepare a submission object tailored for the Community Council data
    const formData = {
        location: {
            district,
            divisionalSec,
            gnDivision,
            cdcVdpId,
        },
        communityCouncil: councilData,
        // Empty selectors and data for this specific form type
        selection: {
            sector: "Community Council Only",
            subCategory: "",
            subSubCategory: "",
            subSubSubCategory: "",
        },
        data: {}, 
        proposals: [],
    };
    
    // Add validation (optional but recommended)
    if (!district || !divisionalSec || !gnDivision) {
        alert("Please select the District, DS Division, and GN Division.");
        return;
    }
    if (councilData.committeeMembers.length === 0 && councilData.communityReps.length === 0 && councilData.strategicMembers.length === 0) {
        alert("Please enter at least one member's information in the table.");
        return;
    }

    try {
        console.log("Community Council Form Submitted Data:", JSON.stringify(formData, null, 2));
        // await submitForm(formData); // Uncomment when ready to submit to backend
        alert("Community Council Form submitted successfully (see console for data)!");
    } catch (error) {
        console.error("Error submitting form:", error);
        alert(`Error submitting form: ${error.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">ප්‍රජා සංවර්ධන සභා සාමාජික තොරතුරු</h2>
      <form onSubmit={handleSubmit}>
        <LocationSelectorBase // Using a new minimal selector base
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
        />

        <CommunityCouncilTable
            data={communityCouncilData}
            onChange={handleCouncilRowChange}
            onAddRow={addCouncilRow}
            deleteCouncilRow={deleteCouncilRow}
        />

        <button type="submit" className="btn btn-primary btn-submit">
          ඉදිරිපත් කරන්න
        </button>
      </form>
    </div>
  );
};

export default CommunityCouncilForm;