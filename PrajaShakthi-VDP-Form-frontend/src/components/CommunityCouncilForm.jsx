import React, { useState, useEffect } from "react";
import provincialDataJson from "../data/provincial_data.json";
import LocationSelectorBase from "./LocationSelectorBase";
import CommunityCouncilTable from "./CommunityCouncilTable";
import { submitForm } from "../api/auth";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

// Initial state structures for the Community Council Table
// UPDATED: Added 'whatsapp', 'nic', 'gender', 'permanentAddress' fields
const emptyCouncilRow = {
  name: "",
  position: "",
  phone: "",
  whatsapp: "",
  nic: "",
  gender: "",
  permanentAddress: "",
};
const MAX_ROWS = 25;

// UPDATED: Initialize ALL 25 slots with isVisible: true
const initialCommunityCouncilData = Array(MAX_ROWS)
  .fill(null)
  .map(() => ({
    ...emptyCouncilRow,
    isVisible: true,
  }));

// The total length is 10 digits (07 + 1 digit + 7 digits)
const SRI_LANKA_PHONE_REGEX = /^07[0-9]{8}$/;

// ADDED: Function to check if a row is completely empty
const isRowEmpty = (row) =>
  !(
    (row.name && row.name.trim() !== "") ||
    (row.position && row.position.trim() !== "") ||
    (row.phone && row.phone.trim() !== "") ||
    (row.whatsapp && row.whatsapp.trim() !== "") ||
    (row.nic && row.nic.trim() !== "") ||
    (row.gender && row.gender.trim() !== "") ||
    (row.permanentAddress && row.permanentAddress.trim() !== "")
  );

const CommunityCouncilForm = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // State for form inputs and selections
  const [district, setDistrict] = useState("");
  const [divisionalSec, setDivisionalSec] = useState("");
  const [gnDivision, setGnDivision] = useState("");

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

    // Auto-populate for DS users
    if (user && user.role === "ds_user") {
      if (user.district) {
        setDistrict(user.district);
        // Find and set DS divisions for the user's district
        const selectedDistrictData = allDistricts.find(
          (d) => d.district.trim() === user.district
        );
        if (selectedDistrictData) {
          setDsDivisions(selectedDistrictData.ds_divisions);

          // Set divisional secretariat
          if (user.divisionalSecretariat) {
            setDivisionalSec(user.divisionalSecretariat);

            // Find and set GN divisions
            const selectedDsData = selectedDistrictData.ds_divisions.find(
              (ds) => ds.ds_division_name.trim() === user.divisionalSecretariat
            );
            if (selectedDsData) {
              setGnDivisions(selectedDsData.gn_divisions);
            }
          }
        }
      }
    }
  }, [user]);

  // Set fixed positions for rows 1-4
  useEffect(() => {
    setCommunityCouncilData((prev) => {
      const newData = [...prev];
      // Set fixed positions for first 4 rows
      newData[0] = { ...newData[0], position: "President" };
      newData[1] = { ...newData[1], position: "Secretary" };
      newData[2] = { ...newData[2], position: "Grama Niladhari" };
      newData[3] = { ...newData[3], position: "Samurdhi Development Officer" };
      return newData;
    });
  }, [t]);

  // Event handlers for cascading dropdowns (unchanged)
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
  const handleCouncilRowChange = (index, field, value) => {
    setCommunityCouncilData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Location Validation (Mandatory Block)
    if (!district || !divisionalSec || !gnDivision) {
      alert(t("form.selectLocation"));
      return;
    }

    // 2. Data Validation Checks
    let validationErrors = [];
    let isSequentialOrderViolated = false;
    let hasFilledRowBeforeEmpty = false;
    let hasFilledRow = false; // To check for general empty warning

    for (let i = 0; i < MAX_ROWS; i++) {
      const row = communityCouncilData[i];
      const rowNumber = i + 1;
      const isCurrentRowEmpty = isRowEmpty(row);
      const isCurrentRowTouched = !isCurrentRowEmpty;

      if (isCurrentRowTouched) {
        hasFilledRow = true;

        // 2a) Sequential Filling Check: A filled row cannot follow an empty one.
        if (hasFilledRowBeforeEmpty) {
          isSequentialOrderViolated = true;
        }

        // 2b) Conditional Required Fields Check (If touched, ALL fields are required)
        // For rows 1-5: name, position, phone, whatsapp, nic, gender, permanentAddress are required
        // For rows 6-25: name, phone, whatsapp, nic, gender, permanentAddress are required (no position)
        let requiredFields = [];

        if (i < 5) {
          // Rows 1-5: All fields including position
          requiredFields = [
            { field: "name", label: t("form.name") },
            { field: "position", label: t("form.position") },
            { field: "phone", label: t("form.phone") },
            { field: "whatsapp", label: t("form.whatsapp") },
            { field: "nic", label: "NIC" },
            { field: "gender", label: "Gender" },
            { field: "permanentAddress", label: "Permanent Address" },
          ];
        } else {
          // Rows 6-25: All fields except position
          requiredFields = [
            { field: "name", label: t("form.name") },
            { field: "phone", label: t("form.phone") },
            { field: "whatsapp", label: t("form.whatsapp") },
            { field: "nic", label: "NIC" },
            { field: "gender", label: "Gender" },
            { field: "permanentAddress", label: "Permanent Address" },
          ];
        }

        requiredFields.forEach(({ field, label }) => {
          if (!row[field] || row[field].toString().trim() === "") {
            validationErrors.push(
              `Row ${rowNumber}: ${label} ${t("form.requiredField")}`
            );
          }
        });

        // 2c) Phone/WhatsApp Format Validation
        const phoneValue = row.phone ? row.phone.toString().trim() : "";
        const whatsappValue = row.whatsapp
          ? row.whatsapp.toString().trim()
          : "";

        if (phoneValue && !SRI_LANKA_PHONE_REGEX.test(phoneValue)) {
          validationErrors.push(`Row ${rowNumber}: ${t("form.invalidPhone")}`);
        }

        if (whatsappValue && !SRI_LANKA_PHONE_REGEX.test(whatsappValue)) {
          validationErrors.push(`Row ${rowNumber}: ${t("form.invalidPhone")}`);
        }
      } else {
        // Mark that an empty row was found *before* the loop is complete
        hasFilledRowBeforeEmpty = true;
      }
    }

    // 3. Handle Critical Validation Errors (Blocking Submission)
    if (validationErrors.length > 0) {
      alert(`${t("form.validationError")}\n\n${validationErrors.join("\n")}`);
      return;
    }

    // 4. Handle Non-Critical Warnings (Non-Blocking, User Confirmation)
    let warningMessage = "";

    // Sequential Order Warning
    if (isSequentialOrderViolated) {
      warningMessage += `⚠️ ${t("form.sequentialError")}\n\n`;
    }

    // Empty Row Warning
    if (!hasFilledRow) {
      warningMessage +=
        "⚠️ Warning: No community council members' information has been filled.";
    }

    // Display warning if present (user requested to "just indicate" but allow submit)
    if (warningMessage) {
      if (!window.confirm(`${warningMessage}\n\nDo you wish to proceed?`)) {
        return; // User cancelled the submission
      }
    }

    // --- Submission Logic ---

    // Function to check if a row has any meaningful data (Used for filtering for submission)
    const filterHasData = (row) =>
      (row.name && row.name.trim() !== "") ||
      (row.position && row.position.trim() !== "") ||
      (row.phone && row.phone.trim() !== "") ||
      (row.whatsapp && row.whatsapp.trim() !== "") ||
      (row.nic && row.nic.trim() !== "") ||
      (row.gender && row.gender.trim() !== "") ||
      (row.permanentAddress && row.permanentAddress.trim() !== "");

    const councilData = {
      committeeMembers: communityCouncilData.slice(0, 5).filter(filterHasData),
      communityReps: communityCouncilData.slice(5, 20).filter(filterHasData),
      strategicMembers: communityCouncilData
        .slice(20, 25)
        .filter(filterHasData),
    };

    // Prepare a submission object tailored for the Community Council data
    const formData = {
      formType: "council_info",

      location: {
        district,
        divisionalSec,
        gnDivision,
      },
      communityCouncil: councilData,
      selection: {},
      data: {},
      proposals: [],
    };

    try {
      await submitForm(formData);
      alert(t("form.successMessage"));
      // Optionally reset the form here
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`${t("form.errorTitle")}: ${error.message}`);
    }
  };
  return (
    <div className="max-w-4xl mx-auto my-8 sm:my-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-center text-[#A8234A] mb-10 sm:mb-12 font-semibold text-xl sm:text-2xl leading-relaxed">
        {t("council.title")}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <LocationSelectorBase
          district={district}
          divisionalSec={divisionalSec}
          gnDivision={gnDivision}
          districts={districts}
          dsDivisions={dsDivisions}
          gnDivisions={gnDivisions}
          handleDistrictChange={handleDistrictChange}
          handleDivisionalSecChange={handleDivisionalSecChange}
          setGnDivision={setGnDivision}
          isDistrictDisabled={user && user.role === "ds_user"}
          isDSDisabled={user && user.role === "ds_user"}
        />

        <CommunityCouncilTable
          data={communityCouncilData}
          onChange={handleCouncilRowChange}
        />

        <button
          type="submit"
          className="w-full bg-[#F37021] hover:bg-[#D65F1A] text-white font-medium py-3 px-5 rounded-md mt-5 transition-all duration-200 text-base sm:text-lg active:translate-y-0.5"
        >
          {t("form.submit")}
        </button>
      </form>
    </div>
  );
};

export default CommunityCouncilForm;
