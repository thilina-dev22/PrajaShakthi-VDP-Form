import React, { useState, useEffect } from "react";
import provincialDataJson from "../data/provincial_data.json";
import LocationSelectorBase from "./LocationSelectorBase";
import CommunityCouncilTable from "./CommunityCouncilTable";
// eslint-disable-next-line no-unused-vars
import { submitForm } from "../api/auth";

// Initial state structures for the Community Council Table
// UPDATED: Added 'whatsapp' field
const emptyCouncilRow = {
  name: "",
  position: "",
  phone: "",
  whatsapp: "",
  email: "",
};
const MAX_ROWS = 25;

// UPDATED: Initialize ALL 25 slots with isVisible: true
const initialCommunityCouncilData = Array(MAX_ROWS)
  .fill(null)
  .map(() => ({
    ...emptyCouncilRow,
    isVisible: true,
  }));

const CommunityCouncilForm = () => {
  // State for form inputs and selections
  const [district, setDistrict] = useState("");
  const [divisionalSec, setDivisionalSec] = useState("");
  const [gnDivision, setGnDivision] = useState("");
  // REMOVED: cdcVdpId state

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

  // --- Community Council Table Handlers ---
  // REMOVED: getSectionInfo, addCouncilRow, and deleteCouncilRow functions

  const handleCouncilRowChange = (index, field, value) => {
    setCommunityCouncilData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- START of MODIFIED LOGIC ---

    // Function to replace empty strings with null for a member row
    const processMemberData = (row) => ({
      name: row.name.trim() === "" ? null : row.name,
      position: row.position.trim() === "" ? null : row.position,
      phone: row.phone.trim() === "" ? null : row.phone,
      whatsapp: row.whatsapp.trim() === "" ? null : row.whatsapp,
      email: row.email.trim() === "" ? null : row.email,
      // Keep isVisible for full row structure, although it's not strictly necessary for the final log
      isVisible: row.isVisible,
    });

    // Process all 25 rows and categorize them
    const allProcessedData = communityCouncilData.map(processMemberData);

    const councilData = {
      committeeMembers: allProcessedData.slice(0, 5), // Rows 1-5
      communityReps: allProcessedData.slice(5, 20), // Rows 6-20
      strategicMembers: allProcessedData.slice(20, 25), // Rows 21-25
    };

    // Prepare a submission object tailored for the Community Council data
    const formData = {
      location: {
        district,
        divisionalSec,
        gnDivision,
        // REMOVED: cdcVdpId,
      },
      communityCouncil: councilData,
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
    // Simple check to ensure at least one row was filled if needed (optional based on final app requirements)
    /*
    if (councilData.committeeMembers.length === 0 && councilData.communityReps.length === 0 && councilData.strategicMembers.length === 0) {
        alert("Please enter at least one member's information in the table.");
        return;
    }
    */

    try {
      // Log the data entered to Community Council Form
      console.log(
        "Community Council Form Submitted Data:",
        JSON.stringify(formData, null, 2)
      );

      // await submitForm(formData);
      alert(
        "Community Council Form submitted successfully (Data logged to console)!"
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error submitting form: ${error.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">ප්‍රජා සංවර්ධන සභා සාමාජික තොරතුරු</h2>
      <form onSubmit={handleSubmit}>
        <LocationSelectorBase
          district={district}
          divisionalSec={divisionalSec}
          gnDivision={gnDivision}
          // REMOVED: cdcVdpId={cdcVdpId}
          districts={districts}
          dsDivisions={dsDivisions}
          gnDivisions={gnDivisions}
          handleDistrictChange={handleDistrictChange}
          handleDivisionalSecChange={handleDivisionalSecChange}
          setGnDivision={setGnDivision}
          // REMOVED: setCdcVdpId={setCdcVdpId}
        />

        <CommunityCouncilTable
          data={communityCouncilData}
          onChange={handleCouncilRowChange}
          // REMOVED: onAddRow and deleteCouncilRow props
        />

        <button type="submit" className="btn btn-primary btn-submit">
          ඉදිරිපත් කරන්න
        </button>
      </form>
    </div>
  );
};

export default CommunityCouncilForm;
