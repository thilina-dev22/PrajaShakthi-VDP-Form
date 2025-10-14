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

    // Function to check if a row has any meaningful data
    const hasData = (row) =>
      (row.name && row.name.trim() !== "") ||
      (row.position && row.position.trim() !== "") ||
      (row.phone && row.phone.trim() !== "") ||
      (row.whatsapp && row.whatsapp.trim() !== "") ||
      (row.email && row.email.trim() !== "");

    // Filter out rows that are completely empty before categorizing
    const filledData = communityCouncilData.filter(hasData);

    const councilData = {
      committeeMembers: communityCouncilData.slice(0, 5).filter(hasData),
      communityReps: communityCouncilData.slice(5, 20).filter(hasData),
      strategicMembers: communityCouncilData.slice(20, 25).filter(hasData),
    };

    // Prepare a submission object tailored for the Community Council data
    const formData = {
      // ⭐ ADD formType ⭐
      formType: "council_info",

      location: {
        district,
        divisionalSec,
        gnDivision,
      },
      communityCouncil: councilData,
      // Add empty placeholders for other fields to match the model
      selection: {},
      data: {},
      proposals: [],
    };

    // Add validation
    if (!district || !divisionalSec || !gnDivision) {
      alert("Please select the District, DS Division, and GN Division.");
      return;
    }

    try {
      // ⭐ THIS IS THE KEY CHANGE: Call the API ⭐
      await submitForm(formData);
      alert("Council Information Submitted Successfully!");
      // Optionally reset the form here
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
