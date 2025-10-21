import React, { useState, useEffect } from "react";
import provincialDataJson from "../data/provincial_data.json";
import LocationSelector from "./DevelopmentFormLocation";
import DynamicContent from "./DynamicContent";
import Proposals from "./Proposals";
import { submitForm } from "../api/auth";
import { sectors } from "../data/sectors_data.js";
import SectorSelector from "./SectorSelector";

const DevelopmentForm = () => {
  const [district, setDistrict] = useState("");
  const [divisionalSec, setDivisionalSec] = useState("");
  const [gnDivision, setGnDivision] = useState("");
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

  useEffect(() => {
    const allDistricts = provincialDataJson[0]?.districts || [];
    setDistricts(allDistricts);
  }, []);

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
          const allFixedRows = [
            ...(currentSection.mainRows || []),
            ...(currentSection.finalRows || []),
          ];
          allFixedRows.forEach((row) => {
            initialFixedData[row.id] = {};
            currentSection.tableColumns.forEach((col) => {
              initialFixedData[row.id][col.header] = "";
            });
          });

          const dynamicPart = currentSection.dynamicRow
            ? [
                {
                  id: `${currentSection.dynamicRow.idPrefix}_${Date.now()}`,
                  description: "",
                  ...currentSection.tableColumns.reduce(
                    (acc, col) => ({ ...acc, [col.header]: "" }),
                    {}
                  ),
                },
              ]
            : [];
          setTableData({ fixed: initialFixedData, dynamic: dynamicPart });
        }
        if (currentSection.secondaryTable) {
          setSecondaryTableData([]);
        }
      } else {
        setTableData(null);
        setSecondaryTableData([]);
      }
    },
    [currentSection]
  );

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
      (acc, col) => ({ ...acc, [col.header]: "" }),
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
      (acc, col) => ({ ...acc, [col.header]: "" }),
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
      newRow[col.header] = "";
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

    const formData = {
      formType: "main_form",
      location: {
        district,
        divisionalSec,
        gnDivision,
      },
      communityCouncil: {
        committeeMembers: [],
        communityReps: [],
        strategicMembers: [],
      },
      selection: {
        sector,
        subCategory,
        subSubCategory,
        subSubSubCategory,
      },
      data: collectedData,
      proposals,
    };

    try {
      console.log("Form Submitted Data:", JSON.stringify(formData, null, 2));
      await submitForm(formData);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error submitting form: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 sm:p-8 bg-white rounded-lg shadow-lg">
      <h2 className="form-title">
        ඒකාබද්ධ ග්‍රාම සංවර්ධන සැලැස්ම <br />
        ஒருங்கிணைந்த கிராம வளர்ச்சி திட்டம் <br />
        Integrated Village Development Plan
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <LocationSelector
          district={district}
          divisionalSec={divisionalSec}
          gnDivision={gnDivision}
          districts={districts}
          dsDivisions={dsDivisions}
          gnDivisions={gnDivisions}
          handleDistrictChange={handleDistrictChange}
          handleDivisionalSecChange={handleDivisionalSecChange}
          setGnDivision={setGnDivision}
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

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
          ඉදිරිපත් කරන්න
        </button>
      </form>
    </div>
  );
};

export default DevelopmentForm;